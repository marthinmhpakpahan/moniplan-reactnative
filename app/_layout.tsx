import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import './globals.css';

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    aestera: require('../assets/fonts/Aestera.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log("Font Loaded!")
    }
  }, [fontsLoaded]);

  return (<Slot />);
}
