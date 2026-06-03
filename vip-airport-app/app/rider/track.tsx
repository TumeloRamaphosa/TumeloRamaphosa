import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AppText, Badge, Button, Card, Row } from '@/components/ui';
import { StreetViewPano } from '@/components/StreetViewPano';
import { palette, spacing } from '@/constants/theme';
import { OR_TAMBO_TRACK } from '@/data/orTamboTrack';

/**
 * A standalone, swipe-through preview of the entire OR Tambo VIP walking
 * track in Google Street View. Lets a guest rehearse the exact path from
 * VIP arrivals to the aircraft before they ever set foot in the terminal.
 */
export default function Track() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const wp = OR_TAMBO_TRACK[i];
  const isFirst = i === 0;
  const isLast = i === OR_TAMBO_TRACK.length - 1;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="h2">Street View walkthrough</AppText>
        <Badge label={`${i + 1}/${OR_TAMBO_TRACK.length}`} tone="gold" />
      </Row>
      <AppText variant="caption" color={palette.textMuted}>
        OR Tambo International — VIP arrivals to aircraft
      </AppText>

      <StreetViewPano waypoint={wp} />

      <Card style={{ gap: spacing.xs }}>
        <AppText variant="h2" color={palette.gold}>
          {wp.title}
        </AppText>
        <AppText variant="body" color={palette.textMuted}>
          {wp.description}
        </AppText>
        {wp.walk_minutes > 0 ? (
          <AppText variant="caption" color={palette.textFaint} style={{ marginTop: spacing.sm }}>
            ~{wp.walk_minutes} min walk to the next point
          </AppText>
        ) : (
          <AppText variant="caption" color={palette.gold} style={{ marginTop: spacing.sm }}>
            Final point — the aircraft.
          </AppText>
        )}
      </Card>

      <Row style={{ gap: spacing.md }}>
        <Button
          title="Back"
          variant="secondary"
          onPress={() => setI((v) => Math.max(0, v - 1))}
          disabled={isFirst}
          style={{ flex: 1 }}
        />
        {isLast ? (
          <Button title="Done" onPress={() => router.back()} style={{ flex: 1 }} />
        ) : (
          <Button
            title="Next stop"
            onPress={() => setI((v) => Math.min(OR_TAMBO_TRACK.length - 1, v + 1))}
            style={{ flex: 1 }}
          />
        )}
      </Row>

      <View style={styles.progressRow}>
        {OR_TAMBO_TRACK.map((w, idx) => (
          <View
            key={w.index}
            style={[
              styles.pip,
              { backgroundColor: idx <= i ? palette.gold : palette.border },
            ]}
          />
        ))}
      </View>
      <View style={{ height: spacing.lg }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  pip: { width: 22, height: 4, borderRadius: 2 },
});
