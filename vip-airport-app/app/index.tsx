import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { AppText, Button, Card, Badge } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { palette, radius, spacing } from '@/constants/theme';
import type { UserRole } from '@/types';
import { hasBackend } from '@/lib/env';
import { validateInvite } from '@/lib/invites';

/**
 * Entry screen. Aviar is invite-only: riders must present a valid invitation
 * code before onboarding. Chauffeurs and airport agents are staff and enter
 * through their own role doors. (Production: gate this behind Supabase OTP and
 * redeem the invite against the signed-in user.)
 */
export default function Welcome() {
  const { profile, signInAs } = useApp();
  const router = useRouter();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (profile) {
    const home =
      profile.role === 'rider'
        ? '/rider'
        : profile.role === 'driver'
          ? '/driver'
          : '/agent';
    return <Redirect href={home} />;
  }

  function enter(role: UserRole, href: string) {
    signInAs(role);
    router.replace(href);
  }

  async function verifyAndEnter() {
    setChecking(true);
    setError(null);
    try {
      const res = await validateInvite(code);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      // The invite is redeemed server-side after the user authenticates.
      enter('rider', '/rider');
    } finally {
      setChecking(false);
    }
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.xxl }}>
        <View style={{ alignItems: 'center', gap: spacing.md }}>
          <Brand size="lg" />
          <AppText
            variant="h2"
            color={palette.textMuted}
            style={{ textAlign: 'center' }}
          >
            From your door to the door of the aircraft.
          </AppText>
          <Badge label="INVITE ONLY • PRIVATE VIP CONCIERGE" tone="gold" />
        </View>

        {inviteOpen ? (
          <Card style={{ gap: spacing.md }}>
            <AppText variant="h2">Enter your invitation</AppText>
            <AppText variant="caption" color={palette.textMuted}>
              Aviar membership is by invitation only.
              {hasBackend ? '' : ' Demo code: AVIAR-VIP'}
            </AppText>
            <TextInput
              placeholder="Invitation code"
              placeholderTextColor={palette.textFaint}
              autoCapitalize="characters"
              autoCorrect={false}
              value={code}
              onChangeText={(t) => {
                setCode(t);
                if (error) setError(null);
              }}
              style={styles.input}
            />
            {error ? (
              <AppText variant="caption" color={palette.danger}>
                {error}
              </AppText>
            ) : null}
            <Button
              title="Verify & enter"
              onPress={verifyAndEnter}
              loading={checking}
            />
            <Button
              title="Back"
              variant="ghost"
              onPress={() => {
                setInviteOpen(false);
                setError(null);
              }}
            />
          </Card>
        ) : (
          <View style={{ gap: spacing.md }}>
            <AppText variant="label" color={palette.textMuted}>
              CONTINUE AS
            </AppText>

            <RoleCard
              title="Rider"
              subtitle="Book a chauffeur & VIP airport escort"
              cta="Request entry"
              onPress={() => setInviteOpen(true)}
            />
            <RoleCard
              title="Chauffeur"
              subtitle="Accept trips and complete the airport hand-off"
              onPress={() => enter('driver', '/driver')}
            />
            <RoleCard
              title="Airport VIP Agent"
              subtitle="Meet guests and escort them to the aircraft"
              onPress={() => enter('vip_agent', '/agent')}
            />
          </View>
        )}

        <AppText
          variant="caption"
          color={palette.textFaint}
          style={{ textAlign: 'center' }}
        >
          {hasBackend
            ? 'Connected to Supabase backend.'
            : 'Demo mode — Supabase not configured. The journey runs locally.'}
        </AppText>
      </View>
    </Screen>
  );
}

function RoleCard({
  title,
  subtitle,
  cta = 'Enter',
  onPress,
}: {
  title: string;
  subtitle: string;
  cta?: string;
  onPress: () => void;
}) {
  return (
    <Card style={styles.roleCard}>
      <View style={{ flex: 1 }}>
        <AppText variant="h2">{title}</AppText>
        <AppText variant="caption" color={palette.textMuted}>
          {subtitle}
        </AppText>
      </View>
      <Button title={cta} onPress={onPress} style={{ paddingHorizontal: spacing.lg }} />
    </Card>
  );
}

const styles = StyleSheet.create({
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  input: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    letterSpacing: 1,
  },
});
