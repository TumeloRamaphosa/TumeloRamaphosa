import { supabase } from './supabase';
import { hasBackend } from './env';

/**
 * Aviar is invite-only. A rider must present a valid, unredeemed invite code to
 * onboard. In demo mode (no backend) we accept a small set of showcase codes;
 * with Supabase we validate against the `invite_codes` table.
 */

const DEMO_CODES = new Set(['AVIAR-VIP', 'SOVEREIGN', 'ORTAMBO']);

export interface InviteResult {
  ok: boolean;
  message: string;
}

function normalize(code: string): string {
  return code.trim().toUpperCase();
}

/** Check whether an invite code is valid (does not redeem it). */
export async function validateInvite(rawCode: string): Promise<InviteResult> {
  const code = normalize(rawCode);
  if (!code) return { ok: false, message: 'Enter your invitation code.' };

  if (!hasBackend) {
    return DEMO_CODES.has(code)
      ? { ok: true, message: 'Welcome to Aviar.' }
      : { ok: false, message: 'That code isn’t recognised. Try AVIAR-VIP.' };
  }

  // Validity check goes through a SECURITY DEFINER RPC so the code list is
  // never exposed to clients (no direct table read).
  const { data, error } = await supabase.rpc('check_invite', { p_code: code });
  if (error) return { ok: false, message: 'Could not verify code. Try again.' };
  return data === true
    ? { ok: true, message: 'Welcome to Aviar.' }
    : { ok: false, message: 'Invalid or already-used invitation code.' };
}

/**
 * Atomically redeem an invite for the signed-in user (backend only). Returns
 * true if this call claimed the code. Redemption is race-safe server-side, so
 * a code can only ever be used once. Requires an authenticated session.
 */
export async function redeemInvite(rawCode: string): Promise<boolean> {
  if (!hasBackend) return true;
  const { data, error } = await supabase.rpc('redeem_invite', {
    p_code: normalize(rawCode),
  });
  if (error) return false;
  return data === true;
}
