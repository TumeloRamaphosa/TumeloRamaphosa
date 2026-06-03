import React from 'react';
import { Stack } from 'expo-router';
import { palette } from '@/constants/theme';

export default function RiderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.bg },
      }}
    />
  );
}
