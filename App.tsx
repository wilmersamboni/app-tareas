import React, { useState } from 'react';
import { AppNavigator } from './src/navigation';
import { SplashScreen } from './src/screens/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <AppNavigator />;
}