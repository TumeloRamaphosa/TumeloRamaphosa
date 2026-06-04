import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AppText, Badge, Button, Card, Divider, Row } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { palette, radius, spacing } from '@/constants/theme';
import type { VipTier } from '@/types';

/** Marketing-friendly headline perk per membership tier. */
const TIER_PERK: Record<VipTier, string> = {
  member: 'Priority booking',
  gold: 'Fast-track security',
  platinum: 'Lounge access + fast-track',
  sovereign: 'Door-to-aircraft escort',
};

/** Settings rows are static + no-op in the demo; onPress just logs. */
const SETTINGS = [
  'Payment methods',
  'Saved places',
  'Help & support',
  'Terms & privacy',
] as const;

/** Derive up-to-two uppercase initials from a full name. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase();
}

export default function Profile() {
  const { profile, signOut } = useApp();
  const router = useRouter();

  // Local-only preference toggles (no persistence in the demo).
  const [delayAutoAdjust, setDelayAutoAdjust] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);

  function onSignOut() {
    signOut();
    router.replace('/');
  }

  // Graceful fallback when no profile is loaded (e.g. signed out mid-render).
  if (!profile) {
    return (
      <Screen>
        <AppText variant="h2">Profile</AppText>
        <Card>
          <AppText variant="body" color={palette.textMuted}>
            No profile loaded. Please sign in to view your membership.
          </AppText>
        </Card>
        <Button title="Back to start" variant="ghost" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const vipYear = new Date(profile.created_at).getFullYear();
  const tierLabel = profile.vip_tier.toUpperCase();

  return (
    <Screen>
      {/* 1. Header */}
      <Row style={styles.spread}>
        <AppText variant="h2">Profile</AppText>
        <Badge label={tierLabel} tone="gold" />
      </Row>

      {/* 2. Identity */}
      <Card style={styles.identityCard}>
        {/* Avatar from initials (no remote images in the demo). */}
        <View style={styles.avatar}>
          <AppText variant="h1" color={palette.gold}>
            {initialsOf(profile.full_name)}
          </AppText>
        </View>
        <AppText variant="h1">{profile.full_name}</AppText>
        {profile.phone ? (
          <AppText variant="caption" color={palette.textMuted}>
            {profile.phone}
          </AppText>
        ) : null}
        <AppText variant="caption" color={palette.textFaint}>
          VIP since {vipYear}
        </AppText>
      </Card>

      {/* 3. Membership */}
      <Card style={styles.cardGap}>
        <AppText variant="label" color={palette.textMuted}>
          MEMBERSHIP
        </AppText>
        <Row style={styles.spread}>
          <Badge label={tierLabel} tone="gold" />
          <AppText variant="caption" color={palette.gold}>
            {TIER_PERK[profile.vip_tier]}
          </AppText>
        </Row>
      </Card>

      {/* 4. Preferences */}
      <Card style={styles.cardGap}>
        <AppText variant="label" color={palette.textMuted}>
          PREFERENCES
        </AppText>
        <PreferenceRow
          label="Flight-delay auto-adjust"
          value={delayAutoAdjust}
          onValueChange={setDelayAutoAdjust}
        />
        <PreferenceRow
          label="SMS trip updates"
          value={smsUpdates}
          onValueChange={setSmsUpdates}
        />
        <PreferenceRow
          label="Save trip history"
          value={saveHistory}
          onValueChange={setSaveHistory}
        />
      </Card>

      {/* 5. Settings */}
      <Card style={styles.settingsCard}>
        <AppText variant="label" color={palette.textMuted} style={styles.settingsHeading}>
          SETTINGS
        </AppText>
        {SETTINGS.map((label, i) => (
          <View key={label}>
            {i > 0 ? <Divider /> : null}
            <Pressable
              onPress={() => console.log(`open: ${label}`)}
              style={({ pressed }) => [styles.settingRow, { opacity: pressed ? 0.6 : 1 }]}
            >
              <AppText variant="body">{label}</AppText>
              <AppText variant="h3" color={palette.textFaint}>
                ›
              </AppText>
            </Pressable>
          </View>
        ))}
      </Card>

      {/* 6. Sign out */}
      <Button title="Sign out" variant="ghost" onPress={onSignOut} />

      {/* 7. Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </Screen>
  );
}

/** A labelled preference toggle styled for the dark theme. */
function PreferenceRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <Row style={styles.prefRow}>
      <AppText variant="body">{label}</AppText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.surfaceAlt, true: palette.goldMuted }}
        thumbColor={value ? palette.gold : palette.textFaint}
        ios_backgroundColor={palette.surfaceAlt}
      />
    </Row>
  );
}

const styles = StyleSheet.create({
  spread: { justifyContent: 'space-between' },
  cardGap: { gap: spacing.md },
  identityCard: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 2,
    borderColor: palette.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  prefRow: { justifyContent: 'space-between', paddingVertical: spacing.xs },
  // Tighten padding so Dividers can span edge-to-edge between rows.
  settingsCard: { paddingVertical: spacing.sm },
  settingsHeading: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bottomSpacer: { height: spacing.xxl },
});
