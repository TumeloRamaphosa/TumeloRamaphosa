import React from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AppText, Badge, Button, Card, Divider, Row } from '@/components/ui';
import { HandoverTimeline } from '@/components/HandoverTimeline';
import { StreetViewPano } from '@/components/StreetViewPano';
import { useApp } from '@/context/AppContext';
import { palette, spacing } from '@/constants/theme';
import { OR_TAMBO_TRACK } from '@/data/orTamboTrack';
import { getServiceLevel } from '@/constants/serviceLevels';

export default function Handover() {
  const { ride, handover } = useApp();
  const router = useRouter();

  if (!ride) return <Redirect href="/rider" />;
  if (!handover) return <Redirect href="/rider/trip" />;

  const wp = OR_TAMBO_TRACK[handover.waypoint_index] ?? OR_TAMBO_TRACK[0];
  const level = getServiceLevel(ride.service_level);
  const complete = handover.step === 'complete';

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="h2">VIP airport escort</AppText>
        <Badge label="OR TAMBO" tone="gold" />
      </Row>

      {/* Agent card */}
      <Card>
        <AppText variant="label" color={palette.textMuted}>
          YOUR AIRPORT AGENT
        </AppText>
        <Row style={{ justifyContent: 'space-between', marginTop: spacing.sm }}>
          <View>
            <AppText variant="h3">{handover.agent_name ?? 'Assigning…'}</AppText>
            <AppText variant="caption" color={palette.textMuted}>
              Meeting you at VIP arrivals with your name board
            </AppText>
          </View>
          <Badge label={level.name.toUpperCase()} tone="gold" />
        </Row>
      </Card>

      {/* Current step + live street view */}
      <Card style={{ gap: spacing.md }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="label" color={palette.textMuted}>
            CURRENT STEP
          </AppText>
          <AppText variant="caption" color={palette.gold}>
            {handover.waypoint_index + 1} / {OR_TAMBO_TRACK.length}
          </AppText>
        </Row>
        <AppText variant="h2" color={palette.gold}>
          {wp.title}
        </AppText>
        <AppText variant="body" color={palette.textMuted}>
          {wp.description}
        </AppText>
        <StreetViewPano waypoint={wp} />
        <Button
          title="Walk the full route in Street View"
          variant="secondary"
          onPress={() => router.push('/rider/track')}
        />
      </Card>

      {/* Timeline */}
      <Card>
        <AppText variant="label" color={palette.textMuted} style={{ marginBottom: spacing.md }}>
          THE ROUTE TO YOUR AIRCRAFT
        </AppText>
        <HandoverTimeline currentIndex={handover.waypoint_index} />
        <Divider />
        {level.apron_transfer ? (
          <AppText variant="caption" color={palette.gold}>
            Sovereign tier: you are escorted onto the apron, right up to the
            aircraft stairs.
          </AppText>
        ) : (
          <AppText variant="caption" color={palette.textMuted}>
            Escort concludes at the boarding gate. Upgrade to Sovereign for an
            apron transfer to the aircraft.
          </AppText>
        )}
      </Card>

      {complete ? (
        <Card style={{ alignItems: 'center', gap: spacing.sm }}>
          <Badge label="HAND-OFF COMPLETE" tone="success" />
          <AppText variant="h2">You're at the aircraft.</AppText>
          <AppText variant="caption" color={palette.textMuted} style={{ textAlign: 'center' }}>
            Thank you for travelling with Aviar VIP. Bon voyage.
          </AppText>
          <Button
            title="Back to home"
            variant="ghost"
            onPress={() => router.replace('/rider')}
            style={{ marginTop: spacing.sm }}
          />
        </Card>
      ) : (
        <Card>
          <AppText variant="caption" color={palette.textFaint}>
            Your agent advances each step as you progress. Follow along here —
            you can preview every stretch in Street View before you walk it.
          </AppText>
        </Card>
      )}
      <View style={{ height: spacing.lg }} />
    </Screen>
  );
}
