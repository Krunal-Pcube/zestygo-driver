import React, { useContext } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import TripDetailsScreen from '../screens/TripDetailsScreen';
import SoundVoiceSettingsScreen from '../screens/Settings/SoundVoiceSettingsScreen';
import NavigationSettingsScreen from '../screens/Settings/NavigationSettingsScreen';
import AccessibilitySettingsScreen from '../screens/Settings/AccessibilitySettingsScreen';
import EmergencyContactScreen from '../screens/Settings/EmergencyContactScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import SignupScreen from '../screens/authScreens/SignupScreen';
import OtpLogin from '../screens/authScreens/OtpLogin';
import ForgotPassword from '../screens/authScreens/ForgotPassword';
import OtpForgotPassword from '../screens/authScreens/OtpForgotPassword';
import ResetPassword from '../screens/authScreens/ResetPassword';
import ResetPasswordSuccess from '../screens/authScreens/ResetPasswordSucess';
import { AuthContext } from '../MVC/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
 
const Stack = createStackNavigator();

const RootNavigator = () => {

  const { auth, loading, } = useContext(AuthContext);

    if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    ); 
  }

  return (    
    <Stack.Navigator
      key={auth?.token ? 'authenticated' : 'unauthenticated'}
      initialRouteName={auth?.token ? 'Drawer' : 'Login'}
      screenOptions={{
        headerShown: false, // 🚀 hides all headers 
      }}
    > 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="OtpLogin" component={OtpLogin} />
      <Stack.Screen name="OtpForgotPassword" component={OtpForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen
        name="ResetPasswordSuccess"
        component={ResetPasswordSuccess}
      />

      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen
        name="TripDetails"
        component={TripDetailsScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="SoundVoiceSettings"
        component={SoundVoiceSettingsScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="NavigationSettings"
        component={NavigationSettingsScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="AccessibilitySettings"
        component={AccessibilitySettingsScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="EmergencyContact"
        component={EmergencyContactScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
     
    </Stack.Navigator>
  );
}

export default RootNavigator;
