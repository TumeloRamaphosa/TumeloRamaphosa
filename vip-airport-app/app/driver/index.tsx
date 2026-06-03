import React, { useState } from 'react';
import { Switch, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { AppText, Badge, Button, Card, Divider, Row } from '@/components/ui';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { MapPreview } from '@/components/MapPreview';
import { useApp } from '@/context/AppContext';
import { palette, spacing } from '@/constants/theme';
import { formatZar } from '@/lib/geo';
import { DEMO_DRIVER_VEHICLE } from '@/constants/demo';
import { getServiceLevel } from '@/constants/serviceLevels';

/**
 * Chauffeur cockpit. Shows the current assignment and lets the chauffeur
 * drive the trip lifecycle through to the airport VIP hand-off.
 */
export default function DriverDashboard() {
  const { ride, confirmPickup, arriveAtAirport, beginHandover } = useApp();
  const [online, setOnline] = useState(true);

  const v = DEMO_DRIVER_VEHICLE;
  const active =
    ride &&
    ['accepted', 'arriving', 'in_progress', 'arrived_airport'].includes(
      ride.status,
    );

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Brand size="sm" />
        <RoleSwitcher />
      </Row>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <AppText variant="h3">{v.vehicle_make} {v.vehicle_model}</AppText>
            <AppText variant="caption" color={palette.textMuted}>
              {v.plate} · ★ {v.rating.toFixed(2)} · {v.trips_completed} trips
            </AppText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText variant="caption" color={online ? palette.success : palette.textMuted}>
              {online ? 'Online' : 'Offline'}
            </AppText>
            <Switch
              value={online}
              onValueChange={setOnline}
              trackColor={{ true: palette.gold, false: palette.border }}
              thumbColor={palette.white}
            />
          </View>
        </Row>
      </Card>

      {active && ride ? (
        <Card style={{ gap: spacing.md }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Badge label="ACTIVE TRIP" tone="gold" />
            <AppText variant="h3" color={palette.gold}>
              {formatZar(ride.fare_zar)}
            </AppText>
          </Row>

          <MapPreview pickup={ride.pickup} destination={ride.destination} height={180} />

          <View>
            <AppText variant="label" color={palette.textMuted}>
              PICKUP
            </AppText>
            <AppText variant="h3">{ride.pickup.label}</AppText>
            <AppText variant="caption" color={palette.textMuted}>
              {ride.pickup.address}
            </AppText>
          </View>
          <Divider />
          <View>
            <AppText variant="label" color={palette.textMuted}>
              DROP-OFF
            </AppText>
            <AppText variant="h3">{ride.destination.label}</AppText>
            <AppText variant="caption" color={palette.textMuted}>
              {getServiceLevel(ride.service_level).name}
              {ride.flight_number ? ` · ${ride.airline ?? ''} ${ride.flight_number}` : ''}
            </AppText>
          </View>

          <DriverAction
            status={ride.status}
            onStart={confirmPickup}
            onArrive={arriveAtAirport}
            onHandoff={beginHandover}
          />
        </Card>
      ) : (
        <Card style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl }}>
          <Badge label="NO ACTIVE TRIP" tone="muted" />
          <AppText variant="h3">Waiting for a VIP request</AppText>
          <AppText
            variant="caption"
            color={palette.textMuted}
            style={{ textAlign: 'center' }}
          >
            New requests appear here. Switch to the Rider view above to book a
            trip and watch it arrive.
          </AppText>
        </Card>
      )}
      <View style={{ height: spacing.lg }} />
    </Screen>
  );
}

function DriverAction({
  status,
  onStart,
  onArrive,
  onHandoff,
}: {
  status: string;
  onStart: () => void;
  onArrive: () => void;
  onHandoff: () => void;
}) {
  if (status === 'accepted' || status === 'arriving') {
    return <Button title="Guest aboard — start trip" onPress={onStart} />;
  }
  if (status === 'in_progress') {
    return <Button title="Arrived at OR Tambo VIP set-down" onPress={onArrive} />;
  }
  if (status === 'arrived_airport') {
    return <Button title="Hand off to airport VIP agent" onPress={onHandoff} />;
  }
  return null;
}
