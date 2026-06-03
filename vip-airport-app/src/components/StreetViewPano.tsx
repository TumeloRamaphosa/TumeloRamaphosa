import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { TrackWaypoint } from '@/types';
import { streetViewHtml } from '@/lib/streetview';
import { env } from '@/lib/env';
import { AppText } from './ui';
import { palette, radius, spacing } from '@/constants/theme';

/**
 * Renders a Google Street View panorama for a single waypoint on the
 * OR Tambo VIP walking track. Uses a WebView + the Maps Embed API so it
 * needs no native map module. On web we render the same embed in an iframe
 * via the Maps Embed URL.
 */
export function StreetViewPano({ waypoint }: { waypoint: TrackWaypoint }) {
  const html = streetViewHtml(waypoint);

  if (Platform.OS === 'web') {
    // On web, react-native-webview is not available; use the embed URL.
    const params = new URLSearchParams({
      key: env.googleMapsApiKey,
      location: `${waypoint.location.lat},${waypoint.location.lng}`,
      heading: String(waypoint.heading),
      pitch: String(waypoint.pitch),
      fov: String(waypoint.fov),
    });
    const src = `https://www.google.com/maps/embed/v1/streetview?${params.toString()}`;
    return (
      <View style={styles.container}>
        {env.googleMapsApiKey ? (
          <iframe
            src={src}
            style={{ border: 0, width: '100%', height: '100%' }}
            loading="lazy"
          />
        ) : (
          <Placeholder />
        )}
      </View>
    );
  }

  if (!env.googleMapsApiKey) {
    return (
      <View style={styles.container}>
        <Placeholder />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

function Placeholder() {
  return (
    <View style={styles.placeholder}>
      <AppText variant="h3" color={palette.gold}>
        Street View preview
      </AppText>
      <AppText
        variant="caption"
        color={palette.textMuted}
        style={{ textAlign: 'center', marginTop: spacing.sm }}
      >
        Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to walk this stretch of OR Tambo
        in Street View before you travel.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
  },
  webview: { flex: 1, backgroundColor: palette.bg },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
});
