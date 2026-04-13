import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/MVC/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/utils/toastConfig';
import { navigationRef } from './src/utils/navigationRef';
import Orientation from 'react-native-orientation-locker';
import { checkInitialNotification, foregroundListener, getFCMToken, notificationOpenedListener, requestNotificationPermission } from './src/utils/pushNotification';
import notifee from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen';
 

const AppContent = () => {
  const { isDarkMode, colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <NavigationContainer ref={navigationRef}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

const App = () => {

  useEffect(() => {
    /* Splash screen */
    const splashTimeout = setTimeout(() => {
      SplashScreen.hide();
    }, 1800);

    /* Lock orientation */
    Orientation.lockToPortrait();

    /* 🔔 PUSH NOTIFICATION SETUP */
    requestNotificationPermission();
    getFCMToken();

    const unsubscribeForeground = foregroundListener();
    const unsubscribeOpened = notificationOpenedListener();

    checkInitialNotification();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // ✅ Handle foreground notification action taps
    const unsubscribeNotifee = notifee.onForegroundEvent(
      ({ type, detail }) => { },
    );

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return () => {
      clearTimeout(splashTimeout);
      Orientation.unlockAllOrientations();

      unsubscribeForeground();
      unsubscribeOpened();
      unsubscribeNotifee();
    };
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
