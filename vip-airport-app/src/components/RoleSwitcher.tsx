import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from './ui';
import { palette, radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

const ROLES: { role: UserRole; label: string; href: string }[] = [
  { role: 'rider', label: 'Rider', href: '/rider' },
  { role: 'driver', label: 'Chauffeur', href: '/driver' },
  { role: 'vip_agent', label: 'Agent', href: '/agent' },
];

/**
 * Lets you hop between the rider, chauffeur, and airport-agent views on a
 * single device without losing the active ride — handy for demoing the
 * full hand-off. Switching keeps shared app state intact.
 */
export function RoleSwitcher() {
  const { role, signInAs } = useApp();
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      {ROLES.map((r) => {
        const active = r.role === role;
        return (
          <Pressable
            key={r.role}
            onPress={() => {
              if (active) return;
              signInAs(r.role);
              router.replace(r.href);
            }}
            style={[
              styles.pill,
              {
                backgroundColor: active ? palette.gold : 'transparent',
                borderColor: active ? palette.gold : palette.border,
              },
            ]}
          >
            <AppText
              variant="caption"
              color={active ? palette.black : palette.textMuted}
            >
              {r.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.sm },
  pill: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
