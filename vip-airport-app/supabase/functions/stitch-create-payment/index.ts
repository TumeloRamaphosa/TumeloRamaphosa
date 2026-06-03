// Supabase Edge Function: stitch-create-payment
// ---------------------------------------------------------------------------
// Creates a Stitch (stitch.money) payment for a ride and returns a hosted
// checkout URL the app opens in a browser. All secret-bearing work happens
// here, server-side — the client never sees the Stitch client secret.
//
// Deploy:
//   supabase functions deploy stitch-create-payment
//   supabase secrets set STITCH_CLIENT_ID=... STITCH_CLIENT_SECRET=... \
//     STITCH_ENV=sandbox STITCH_REDIRECT_URI=aviar://payment/return \
//     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
//
// NOTE: Stitch's exact Payins flow (client-assertion JWT for the token, the
// GraphQL mutation name, and the redirect field) should be confirmed against
// your Stitch dashboard / docs at https://docs.stitch.money. The structure
// below isolates those details so swapping in the precise calls is a small,
// localised change. Without credentials it returns a sandbox stub so the app
// remains testable end to end.
// ---------------------------------------------------------------------------

import { createClient } from 'jsr:@supabase/supabase-js@2';

interface CreatePaymentBody {
  ride_id: string;
  amount_zar: number;
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    const { ride_id, amount_zar } = (await req.json()) as CreatePaymentBody;
    if (!ride_id || !amount_zar || amount_zar <= 0) {
      return json({ error: 'ride_id and a positive amount_zar are required' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    const redirectUri =
      Deno.env.get('STITCH_REDIRECT_URI') ?? 'aviar://payment/return';

    // 1) Create the payment with Stitch (or a sandbox stub).
    const stitch = await createStitchPayment({
      amountZar: amount_zar,
      reference: ride_id,
      redirectUri,
    });

    // 2) Persist a payments row (service role bypasses RLS).
    const { data: payment, error } = await admin
      .from('payments')
      .insert({
        ride_id,
        amount_zar,
        currency: 'ZAR',
        provider: 'stitch',
        status: 'pending',
        stitch_payment_id: stitch.id,
        checkout_url: stitch.checkoutUrl,
      })
      .select('id')
      .single();

    if (error) throw error;

    // 3) Link the payment to the ride.
    await admin.from('rides').update({ payment_id: payment.id }).eq('id', ride_id);

    return json({
      payment_id: payment.id,
      checkout_url: stitch.checkoutUrl,
      stitch_payment_id: stitch.id,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

interface StitchPayment {
  id: string;
  checkoutUrl: string;
}

/**
 * Obtain a Stitch access token and create a payment request. Falls back to a
 * deterministic sandbox stub when credentials are absent so local/demo flows
 * still work. Replace the marked sections with the exact Stitch Payins calls.
 */
async function createStitchPayment(opts: {
  amountZar: number;
  reference: string;
  redirectUri: string;
}): Promise<StitchPayment> {
  const clientId = Deno.env.get('STITCH_CLIENT_ID');
  const clientSecret = Deno.env.get('STITCH_CLIENT_SECRET');
  const env = Deno.env.get('STITCH_ENV') ?? 'sandbox';

  if (!clientId || !clientSecret) {
    // Sandbox stub — lets the app exercise the full flow without real keys.
    const id = `sandbox_${crypto.randomUUID()}`;
    const url = new URL('https://secure.stitch.money/sandbox/checkout');
    url.searchParams.set('reference', opts.reference);
    url.searchParams.set('amount', opts.amountZar.toFixed(2));
    url.searchParams.set('redirect', opts.redirectUri);
    return { id, checkoutUrl: url.toString() };
  }

  // --- 1) Token (client credentials) -------------------------------------
  // Stitch may require a signed client_assertion JWT instead of a plain
  // client_secret; confirm against your dashboard and adjust this body.
  const tokenRes = await fetch('https://secure.stitch.money/connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'client_paymentrequest',
      audience: 'https://secure.stitch.money/connect/token',
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`Stitch token error: ${await tokenRes.text()}`);
  }
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  // --- 2) Create payment request (GraphQL) -------------------------------
  const query = `
    mutation CreatePaymentRequest($input: CreatePaymentRequestInput!) {
      clientPaymentInitiationRequestCreate(input: $input) {
        paymentInitiationRequest { id url }
      }
    }`;
  const variables = {
    input: {
      amount: { quantity: opts.amountZar, currency: 'ZAR' },
      payerReference: 'AviarVIP',
      beneficiaryReference: opts.reference.slice(0, 12),
      externalReference: opts.reference,
      redirectUri: opts.redirectUri,
    },
  };

  const gqlRes = await fetch('https://api.stitch.money/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!gqlRes.ok) {
    throw new Error(`Stitch payment error: ${await gqlRes.text()}`);
  }
  const result = await gqlRes.json();
  const pr =
    result?.data?.clientPaymentInitiationRequestCreate
      ?.paymentInitiationRequest;
  if (!pr?.url) {
    throw new Error(`Unexpected Stitch response (${env}): ${JSON.stringify(result)}`);
  }
  return { id: pr.id, checkoutUrl: pr.url };
}
