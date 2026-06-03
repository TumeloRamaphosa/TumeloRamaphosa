// Supabase Edge Function: stitch-webhook
// ---------------------------------------------------------------------------
// Receives Stitch payment status callbacks and updates the matching payments
// row. The app reads payments.status (not the redirect) to decide whether to
// dispatch the chauffeur, so this is what makes a payment authoritative.
//
// Deploy:
//   supabase functions deploy stitch-webhook --no-verify-jwt
//   Register the function URL as your webhook endpoint in the Stitch dashboard.
//
// SECURITY: verify the Stitch webhook signature before trusting the payload.
// Stitch signs webhooks (hash header); validate it against STITCH_WEBHOOK_SECRET
// here before applying the update. Left as a clearly-marked TODO.
// ---------------------------------------------------------------------------

import { createClient } from 'jsr:@supabase/supabase-js@2';

type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';

// Map Stitch payment states onto our payment_status enum.
function mapStatus(stitchStatus: string): PaymentStatus {
  switch (stitchStatus?.toLowerCase()) {
    case 'completed':
    case 'settled':
    case 'paymentinitiationcompleted':
      return 'paid';
    case 'pending':
    case 'submitted':
      return 'authorized';
    case 'refunded':
      return 'refunded';
    default:
      return 'failed';
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // TODO: verify Stitch signature header against STITCH_WEBHOOK_SECRET.
    const payload = await req.json();

    // Stitch payloads nest the payment node; be defensive about shape.
    const node =
      payload?.data?.client?.paymentInitiationRequest ??
      payload?.paymentInitiationRequest ??
      payload;

    const stitchId: string | undefined = node?.id;
    const state: string | undefined = node?.status ?? node?.state;
    if (!stitchId || !state) {
      return new Response('Ignored: missing id/state', { status: 200 });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await admin
      .from('payments')
      .update({ status: mapStatus(state) })
      .eq('stitch_payment_id', stitchId);

    if (error) throw error;
    return new Response('ok', { status: 200 });
  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }
});
