import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Brand } from '@/components/Brand';
import { AppText, Badge, Button, Card, Divider, Row } from '@/components/ui';
import { MapPreview } from '@/components/MapPreview';
import { ServiceLevelPicker } from '@/components/ServiceLevelPicker';
import { useApp } from '@/context/AppContext';
import { palette, radius, spacing } from '@/constants/theme';
import { DEMO_PICKUPS, OR_TAMBO_TERMINAL_A } from '@/constants/demo';
import { formatZar } from '@/lib/geo';
import { hasBackend } from '@/lib/env';
import { createRidePayment, openCheckout } from '@/lib/payments';
import type { Place, ServiceLevel } from '@/types';

export default function BookRide() {
  const { profile, quote, bookRide, markPaid, signOut } = useApp();
  const router = useRouter();

  const [pickup, setPickup] = useState<Place>(DEMO_PICKUPS[0]);
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel>('first_class');
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const destination = OR_TAMBO_TERMINAL_A;
  const q = useMemo(
    () => quote(pickup, destination, serviceLevel),
    [pickup, destination, serviceLevel, quote],
  );

  async function onRequest() {
    setSubmitting(true);
    try {
      const ride = bookRide({
        pickup,
        destination,
        serviceLevel,
        airline: airline.trim() || undefined,
        flightNumber: flightNumber.trim() || undefined,
        terminal: 'Terminal A — International Departures',
      });

      if (hasBackend) {
        // Production path: create a Stitch payment and open hosted checkout.
        const { payment_id, checkout_url } = await createRidePayment(
          ride.id,
          ride.fare_zar,
        );
        const outcome = await openCheckout(checkout_url, payment_id);
        if (outcome !== 'paid') {
          Alert.alert('Payment not completed', 'Your chauffeur was not dispatched.');
          setSubmitting(false);
          return;
        }
      }
      // Demo path (or confirmed payment): mark paid and continue.
      markPaid();
      router.push('/rider/trip');
    } catch (e: any) {
      Alert.alert('Something went wrong', e?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <Brand />
        <Pressable onPress={signOut}>
          <AppText variant="caption" color={palette.textMuted}>
            Sign out
          </AppText>
        </Pressable>
      </Row>

      <AppText variant="display">
        Hello, {profile?.full_name?.split(' ')[0] ?? 'guest'}.
      </AppText>
      <AppText variant="body" color={palette.textMuted}>
        Where shall we collect you for OR Tambo?
      </AppText>

      <MapPreview pickup={pickup} destination={destination} height={200} />

      {/* Pickup selection */}
      <Card>
        <AppText variant="label" color={palette.textMuted}>
          PICKUP
        </AppText>
        <View style={styles.chipWrap}>
          {DEMO_PICKUPS.map((p) => {
            const active = p.label === pickup.label;
            return (
              <Pressable
                key={p.label}
                onPress={() => setPickup(p)}
                style={[
                  styles.chip,
                  {
                    borderColor: active ? palette.gold : palette.border,
                    backgroundColor: active ? palette.goldMuted : 'transparent',
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={active ? palette.gold : palette.textMuted}
                >
                  {p.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <Divider />
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="label" color={palette.textMuted}>
              DESTINATION
            </AppText>
            <AppText variant="h3">{destination.label}</AppText>
          </View>
          <Badge label="JNB" tone="gold" />
        </Row>
      </Card>

      {/* Flight details */}
      <Card>
        <AppText variant="label" color={palette.textMuted}>
          FLIGHT DETAILS (OPTIONAL)
        </AppText>
        <Row style={{ gap: spacing.md, marginTop: spacing.sm }}>
          <TextInput
            placeholder="Airline"
            placeholderTextColor={palette.textFaint}
            value={airline}
            onChangeText={setAirline}
            style={[styles.input, { flex: 1.4 }]}
          />
          <TextInput
            placeholder="Flight no."
            placeholderTextColor={palette.textFaint}
            autoCapitalize="characters"
            value={flightNumber}
            onChangeText={setFlightNumber}
            style={[styles.input, { flex: 1 }]}
          />
        </Row>
        <AppText variant="caption" color={palette.textFaint} style={{ marginTop: spacing.sm }}>
          We track your flight so your chauffeur and airport agent adapt to delays.
        </AppText>
      </Card>

      {/* Service level */}
      <AppText variant="label" color={palette.textMuted}>
        CHOOSE YOUR SERVICE — {q.distanceKm} km · ~{q.etaMinutes} min
      </AppText>
      <ServiceLevelPicker
        selected={serviceLevel}
        onSelect={setServiceLevel}
        distanceKm={q.distanceKm}
      />

      <Card style={{ gap: spacing.sm }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="h3">Total</AppText>
          <AppText variant="h2" color={palette.gold}>
            {formatZar(q.fareZar)}
          </AppText>
        </Row>
        <AppText variant="caption" color={palette.textFaint}>
          Paid securely via Stitch · cards & instant EFT · ZAR
        </AppText>
      </Card>

      <Button
        title={`Request VIP Chauffeur · ${formatZar(q.fareZar)}`}
        onPress={onRequest}
        loading={submitting}
      />
      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    color: palette.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
});
