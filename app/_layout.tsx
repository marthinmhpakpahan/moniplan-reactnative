import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import './globals.css';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    aestera: require('../assets/fonts/Aestera.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log("Font Loaded!")
    }
  }, [fontsLoaded]);

  return <Slot />;
}
