import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/ui';

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <View style={{ flex: 1, justifyContent: 'center', padding: 28, gap: 20, backgroundColor: '#f7fbff' }}><Text accessibilityRole="header" style={{ fontSize: 28, fontWeight: '800', color: '#071426' }}>Something went wrong</Text><Text style={{ fontSize: 18, color: '#415873' }}>Reopen this screen to try again.</Text><AppButton label="Try again" onPress={retry} /></View>;
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f7fbff' } }} />
    </>
  );
}
