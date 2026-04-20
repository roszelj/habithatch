/**
 * HabitHatch — React Native entry point
 *
 * This is a scaffold. The full component tree from the web app needs
 * to be ported screen-by-screen into src/components/.
 *
 * Phase routing mirrors the web App.tsx but uses React Navigation
 * instead of plain discriminated-union state, enabling deep linking
 * and back-button support on Android.
 *
 * Current status: scaffold only — renders a placeholder screen.
 * Port each screen from src/components/ by converting HTML→RN primitives
 * and .module.css → StyleSheet objects.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { loadAppDataAsync } from './src/hooks/useSaveData';
import type { AppData } from './src/models/types';

export default function App() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppDataAsync().then(data => {
      setAppData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f0e68c" />
        </View>
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>HabitHatch</Text>
        <Text style={styles.subtitle}>
          {appData
            ? `${appData.profiles.length} profile(s) loaded`
            : 'No saved data — starting fresh'}
        </Text>
        {/* TODO: Replace with full navigation stack */}
        {/* Port screens from src/components/ here */}
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#275b7c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#275b7c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f0e68c',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
  },
});
