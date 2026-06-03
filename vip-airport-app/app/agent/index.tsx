import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { AppText, Badge, Button, Card, Divider, Row } from '@/components/ui';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { StreetViewPano } from '@/components/StreetViewPano';
import { HandoverTimeline } from '@/components/HandoverTimeline';
import { useApp } from '@/context/AppContext';
import { palette, spacing } from '@/constants/theme';
import { OR_TAMBO_TRACK } from '@/data/orTamboTrack';
import { getServiceLevel } from '@/constants/serviceLevels';

/**
 * Airport VIP agent console. The agent advances the guest through each
 * waypoint of the OR Tambo escort — curb, fast-track, lounge, the concourse
 * walk, and finally the apron transfer to the aircraft.
 */
export default function AgentDashboard() {
  const { ride, handover, setHandoverStep, completeRide } = useApp();

  const idx = handover?.waypoint_index ?? 0;
  const wp = OR_TAMBO_TRACK[idx] ?? OR_TAMBO_TRACK[0];
  const isLast = idx >= OR_TAMBO_TRACK.length - 1;
  const complete = handover?.step === 'complete';

  function next() {
    if (!handover) return;
    const nextIdx = Math.min(OR_TAMBO_TRACK.length - 1, idx + 1);
    setHandoverStep(OR_TAMBO_TRACK[nextIdx].step, nextIdx);
  }

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Brand size="sm" />
        <RoleSwitcher />
      </Row>

      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="h2">VIP agent console</AppText>
        <Badge label="OR TAMBO" tone="gold" />
      </Row>

      {!ride || !handover ? (
        <Card style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl }}>
          <Badge label="NO GUEST IN PROGRESS" tone="muted" />
          <AppText variant="h3">Standing by</AppText>
          <AppText
            variant="caption"
            color={palette.textMuted}
            style={{ textAlign: 'center' }}
          >
            A guest appears here once their chauffeur reaches VIP arrivals and
            begins the hand-off. Use the Rider/Chauffeur views above to get a
            trip to this point.
          </AppText>
        </Card>
      ) : (
        <>
          <Card>
            <AppText variant="label" color={palette.textMuted}>
              GUEST
            </AppText>
            <Row style={{ justifyContent: 'space-between', marginTop: spacing.sm }}>
              <View>
                <AppText variant="h3">VIP guest · {ride.airport_code}</AppText>
                <AppText variant="caption" color={palette.textMuted}>
                  {getServiceLevel(ride.service_level).name}
                  {ride.flight_number
                    ? ` · ${ride.airline ?? ''} ${ride.flight_number}`
                    : ''}
                </AppText>
              </View>
              <Badge
                label={getServiceLevel(ride.service_level).apron_transfer ? 'TO AIRCRAFT' : 'TO GATE'}
                tone="gold"
              />
            </Row>
          </Card>

          <Card style={{ gap: spacing.md }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <AppText variant="label" color={palette.textMuted}>
                CURRENT WAYPOINT
              </AppText>
              <AppText variant="caption" color={palette.gold}>
                {idx + 1} / {OR_TAMBO_TRACK.length}
              </AppText>
            </Row>
            <AppText variant="h2" color={palette.gold}>
              {wp.title}
            </AppText>
            <StreetViewPano waypoint={wp} />

            {complete ? (
              <Badge label="HAND-OFF COMPLETE" tone="success" />
            ) : isLast ? (
              <Button title="Complete hand-off at the aircraft" onPress={completeRide} />
            ) : (
              <Button title={`Advance → ${OR_TAMBO_TRACK[idx + 1].title}`} onPress={next} />
            )}
          </Card>

          <Card>
            <AppText
              variant="label"
              color={palette.textMuted}
              style={{ marginBottom: spacing.md }}
            >
              ESCORT PROGRESS
            </AppText>
            <HandoverTimeline currentIndex={idx} />
            <Divider />
            <AppText variant="caption" color={palette.textFaint}>
              The guest sees each step you complete in real time on their device.
            </AppText>
          </Card>
        </>
      )}
      <View style={{ height: spacing.lg }} />
    </Screen>
  );
}
