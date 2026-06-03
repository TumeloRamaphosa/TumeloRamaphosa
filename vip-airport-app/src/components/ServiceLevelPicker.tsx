import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Badge } from './ui';
import { palette, radius, spacing } from '@/constants/theme';
import { SERVICE_LEVELS, estimateFare } from '@/constants/serviceLevels';
import { formatZar } from '@/lib/geo';
import type { ServiceLevel } from '@/types';

export function ServiceLevelPicker({
  selected,
  onSelect,
  distanceKm,
}: {
  selected: ServiceLevel;
  onSelect: (id: ServiceLevel) => void;
  distanceKm: number;
}) {
  return (
    <View style={{ gap: spacing.md }}>
      {SERVICE_LEVELS.map((lvl) => {
        const active = lvl.id === selected;
        return (
          <Pressable
            key={lvl.id}
            onPress={() => onSelect(lvl.id)}
            style={[
              styles.card,
              {
                borderColor: active ? palette.gold : palette.border,
                backgroundColor: active ? palette.goldMuted : palette.surface,
              },
            ]}
          >
            <View style={styles.headerRow}>
              <AppText variant="h2" color={active ? palette.gold : palette.text}>
                {lvl.name}
              </AppText>
              <AppText variant="h2" color={active ? palette.gold : palette.text}>
                {formatZar(estimateFare(lvl, distanceKm))}
              </AppText>
            </View>
            <AppText variant="caption" color={palette.textMuted}>
              {lvl.tagline}
            </AppText>
            <AppText variant="caption" color={palette.textFaint} style={{ marginTop: 2 }}>
              {lvl.vehicle} · up to {lvl.seats} guests
            </AppText>
            <View style={styles.perks}>
              {lvl.fast_track_security ? <Badge label="FAST-TRACK" tone="info" /> : null}
              {lvl.lounge_access ? <Badge label="LOUNGE" tone="info" /> : null}
              {lvl.apron_transfer ? <Badge label="TO THE AIRCRAFT" tone="gold" /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  perks: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
});
