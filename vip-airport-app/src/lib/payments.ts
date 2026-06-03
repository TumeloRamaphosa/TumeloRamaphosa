import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

/**
 * Client-side payment helper for Stitch (stitch.money).
 *
 * The secret-bearing work — exchanging client credentials for a token and
 * creating a payment request against Stitch's API — happens server-side in
 * the Supabase Edge Function `stitch-create-payment`. The app only ever:
 *   1. asks the function to create a payment for a ride, and
 *   2. opens the returned hosted-checkout URL in a secure browser tab.
 *
 * The function returns once Stitch redirects back to our `aviar://` deep
 * link, after which we re-read the payment row to learn the final status.
 */

export interface CreatePaymentResult {
  payment_id: string;
  checkout_url: string;
  stitch_payment_id: string;
}

export async function createRidePayment(
  rideId: string,
  amountZar: number,
): Promise<CreatePaymentResult> {
  const { data, error } = await supabase.functions.invoke<CreatePaymentResult>(
    'stitch-create-payment',
    { body: { ride_id: rideId, amount_zar: amountZar } },
  );
  if (error) throw error;
  if (!data) throw new Error('No response from payment service.');
  return data;
}

export type CheckoutOutcome = 'paid' | 'cancelled' | 'failed';

/**
 * Open the Stitch hosted checkout and wait for the user to return to the
 * app. Stitch redirects to STITCH_REDIRECT_URI (aviar://payment/return),
 * which closes the browser; we then verify the real status from the DB.
 */
export async function openCheckout(
  checkoutUrl: string,
  paymentId: string,
): Promise<CheckoutOutcome> {
  const result = await WebBrowser.openAuthSessionAsync(
    checkoutUrl,
    'aviar://payment/return',
  );

  if (result.type !== 'success') {
    return 'cancelled';
  }

  // Trust the server, not the redirect: read the authoritative status.
  const { data } = await supabase
    .from('payments')
    .select('status')
    .eq('id', paymentId)
    .single();

  if (data?.status === 'paid' || data?.status === 'authorized') return 'paid';
  return 'failed';
}
