import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './ui';
import { palette } from '@/constants/theme';

/** The Aviar wordmark: a gold diamond glyph + name. */
export function Brand({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 18 : size === 'sm' ? 10 : 14;
  const fontSize = size === 'lg' ? 30 : size === 'sm' ? 18 : 24;
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.diamond,
          { width: dim, height: dim, marginRight: dim * 0.7 },
        ]}
      />
      <AppText style={{ fontSize, fontWeight: '700', letterSpacing: 1 }}>
        AVIAR
      </AppText>
      <AppText
        color={palette.gold}
        style={{ fontSize, fontWeight: '300', letterSpacing: 1 }}
      >
        {' '}
        VIP
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  diamond: {
    backgroundColor: palette.gold,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
});
