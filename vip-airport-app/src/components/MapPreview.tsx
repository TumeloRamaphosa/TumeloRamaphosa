import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { LatLng } from '@/types';
import { AppText } from './ui';
import { palette, radius, spacing } from '@/constants/theme';

/**
 * Lightweight route preview. On native we draw a real map with markers and
 * a route line via react-native-maps; on web (and if the module is absent)
 * we fall back to a tasteful schematic so screens still render everywhere.
 */
type Props = {
  pickup: LatLng & { label?: string };
  destination: LatLng & { label?: string };
  driver?: (LatLng & { label?: string }) | null;
  height?: number;
};

export function MapPreview({ pickup, destination, driver, height = 220 }: Props) {
  if (Platform.OS === 'web') {
    return <Schematic pickup={pickup} destination={destination} height={height} />;
  }

  // Lazy require so web bundling never pulls in native map code.
  let MapView: any;
  let Marker: any;
  let Polyline: any;
  let PROVIDER_GOOGLE: any;
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    Polyline = maps.Polyline;
    PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
  } catch {
    return <Schematic pickup={pickup} destination={destination} height={height} />;
  }

  const midLat = (pickup.lat + destination.lat) / 2;
  const midLng = (pickup.lng + destination.lng) / 2;
  const latDelta = Math.abs(pickup.lat - destination.lat) * 2.2 + 0.05;
  const lngDelta = Math.abs(pickup.lng - destination.lng) * 2.2 + 0.05;

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: midLat,
          longitude: midLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        }}
      >
        <Marker
          coordinate={{ latitude: pickup.lat, longitude: pickup.lng }}
          title={pickup.label ?? 'Pickup'}
          pinColor={palette.gold}
        />
        <Marker
          coordinate={{ latitude: destination.lat, longitude: destination.lng }}
          title={destination.label ?? 'Airport'}
        />
        {driver ? (
          <Marker
            coordinate={{ latitude: driver.lat, longitude: driver.lng }}
            title={driver.label ?? 'Chauffeur'}
            pinColor={palette.info}
          />
        ) : null}
        <Polyline
          coordinates={[
            { latitude: pickup.lat, longitude: pickup.lng },
            { latitude: destination.lat, longitude: destination.lng },
          ]}
          strokeColor={palette.gold}
          strokeWidth={3}
        />
      </MapView>
    </View>
  );
}

function Schematic({
  pickup,
  destination,
  height,
}: {
  pickup: { label?: string };
  destination: { label?: string };
  height: number;
}) {
  return (
    <View style={[styles.container, styles.schematic, { height }]}>
      <View style={styles.routeRow}>
        <View style={[styles.dot, { backgroundColor: palette.gold }]} />
        <View style={styles.routeLine} />
        <View style={[styles.dot, { backgroundColor: palette.info }]} />
      </View>
      <View style={styles.routeLabels}>
        <AppText variant="caption" color={palette.textMuted}>
          {pickup.label ?? 'Pickup'}
        </AppText>
        <AppText variant="caption" color={palette.textMuted}>
          {destination.label ?? 'OR Tambo'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
  },
  schematic: { padding: spacing.xl, justifyContent: 'center' },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7 },
  routeLine: { flex: 1, height: 2, backgroundColor: palette.gold, marginHorizontal: spacing.sm },
  routeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
});
