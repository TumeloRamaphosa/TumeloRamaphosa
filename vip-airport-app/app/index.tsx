import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { AppText, Button, Card, Badge } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { palette, spacing } from '@/constants/theme';
import type { UserRole } from '@/types';
import { hasBackend } from '@/lib/env';

/**
 * Entry / role-selection. In a production build this is where Supabase auth
 * (email OTP / phone) lives. For the foundation we let you enter the app in
 * any of the three roles so the full journey is explorable.
 */
export default function Welcome() {
  const { profile, signInAs } = useApp();
  const router = useRouter();

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
          <Badge label="OR TAMBO • PRIVATE VIP CONCIERGE" tone="gold" />
        </View>

        <View style={{ gap: spacing.md }}>
          <AppText variant="label" color={palette.textMuted}>
            CONTINUE AS
          </AppText>

          <RoleCard
            title="Rider"
            subtitle="Book a chauffeur & VIP airport escort"
            onPress={() => enter('rider', '/rider')}
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
  onPress,
}: {
  title: string;
  subtitle: string;
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
      <Button title="Enter" onPress={onPress} style={{ paddingHorizontal: spacing.lg }} />
    </Card>
  );
}

const styles = StyleSheet.create({
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
