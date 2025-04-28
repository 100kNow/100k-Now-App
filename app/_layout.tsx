import { useState, useEffect } from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-reanimated';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react-native';
import { StatusBar } from 'expo-status-bar';


import SplashScreenComponent from './(tabs)/screens/SplashScreen';
import { useColorScheme } from '@/components/useColorScheme';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setTimeout(() => {
        setShowSplash(false);
      }, 2500); // Splash duration
    }
  }, [loaded]);

  if (!loaded || showSplash) {
    return <SplashScreenComponent />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
    <StatusBar style="light" backgroundColor="#000" translucent={false} />

    {/* ⬇️ iOS notch background */}
    <SafeAreaView
      style={{ flex: 0, backgroundColor: '#000' }}   // only top edge
      edges={['top']}
    />
    <PaperProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        
      </Stack>
    </ThemeProvider>
    </PaperProvider>
    </>
  );
}

