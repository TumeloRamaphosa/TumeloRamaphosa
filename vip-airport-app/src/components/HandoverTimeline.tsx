import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './ui';
import { palette, spacing } from '@/constants/theme';
import { OR_TAMBO_TRACK } from '@/data/orTamboTrack';

/**
 * Vertical progress timeline for the OR Tambo VIP escort. Highlights the
 * current waypoint and marks completed steps.
 */
export function HandoverTimeline({ currentIndex }: { currentIndex: number }) {
  return (
    <View>
      {OR_TAMBO_TRACK.map((wp, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const color = done
          ? palette.success
          : active
            ? palette.gold
            : palette.border;
        return (
          <View key={wp.index} style={styles.row}>
            <View style={styles.railCol}>
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: active ? palette.gold : palette.surface,
                    borderColor: color,
                  },
                ]}
              >
                {done ? <AppText color={palette.success}>✓</AppText> : null}
              </View>
              {i < OR_TAMBO_TRACK.length - 1 ? (
                <View
                  style={[
                    styles.rail,
                    { backgroundColor: done ? palette.success : palette.border },
                  ]}
                />
              ) : null}
            </View>
            <View style={styles.content}>
              <AppText
                variant="h3"
                color={active ? palette.gold : done ? palette.text : palette.textMuted}
              >
                {wp.title}
              </AppText>
              <AppText
                variant="caption"
                color={palette.textMuted}
                style={{ marginTop: 2 }}
              >
                {wp.description}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  railCol: { alignItems: 'center', width: 34 },
  node: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: { width: 2, flex: 1, marginVertical: 2, minHeight: 28 },
  content: { flex: 1, paddingBottom: spacing.lg, paddingLeft: spacing.md },
});
