import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import type { Place } from '@/types';

interface LocationState {
  place: Place | null;
  loading: boolean;
  error: string | null;
}

/**
 * On-demand current-location lookup for setting a pickup point. We don't watch
 * continuously — the rider taps "Use my location", we ask for permission, get a
 * single fix, and reverse-geocode it into a friendly label.
 */
export function useDeviceLocation() {
  const [state, setState] = useState<LocationState>({
    place: null,
    loading: false,
    error: null,
  });

  const request = useCallback(async (): Promise<Place | null> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ place: null, loading: false, error: 'Location permission denied' });
        return null;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = pos.coords;

      // Reverse geocode to a human label; tolerate failures gracefully.
      let label = 'Current location';
      let address: string | undefined;
      try {
        const [g] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (g) {
          label = g.name || g.street || g.district || g.city || 'Current location';
          address = [g.street, g.district, g.city]
            .filter(Boolean)
            .join(', ');
        }
      } catch {
        // keep defaults
      }

      const place: Place = { label, address, lat: latitude, lng: longitude };
      setState({ place, loading: false, error: null });
      return place;
    } catch (e) {
      setState({
        place: null,
        loading: false,
        error: e instanceof Error ? e.message : 'Could not get location',
      });
      return null;
    }
  }, []);

  return { ...state, request };
}
