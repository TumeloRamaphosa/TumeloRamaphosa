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

  const { data, error } = await supabase
    .from('invite_codes')
    .select('code, redeemed_at, expires_at')
    .eq('code', code)
    .maybeSingle();

  if (error) return { ok: false, message: 'Could not verify code. Try again.' };
  if (!data) return { ok: false, message: 'Invalid invitation code.' };
  if (data.redeemed_at) return { ok: false, message: 'This code has already been used.' };
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { ok: false, message: 'This invitation has expired.' };
  }
  return { ok: true, message: 'Welcome to Aviar.' };
}

/** Mark an invite code as redeemed by a user (best-effort; backend only). */
export async function redeemInvite(rawCode: string, userId: string): Promise<void> {
  if (!hasBackend) return;
  const code = normalize(rawCode);
  await supabase
    .from('invite_codes')
    .update({ redeemed_at: new Date().toISOString(), redeemed_by: userId })
    .eq('code', code)
    .is('redeemed_at', null);
}
