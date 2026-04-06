import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import TripDetailsScreen from '../screens/TripDetailsScreen';
// import OtpForgotPassword from '../screens/authScreens/OtpForgotPassword';
// import ResetPassword from '../screens/authScreens/ResetPassword';
// import ResetPasswordSuccess from '../screens/authScreens/ResetPasswordSuccess';
// import ForgotPassword from '../screens/authScreens/ForgotPassword';
import LoginScreen from '../screens/authScreens/LoginScreen';
import SignupScreen from '../screens/authScreens/SignupScreen';
import OtpLogin from '../screens/authScreens/OtpLogin';
import ForgotPassword from '../screens/authScreens/ForgotPassword';
import OtpForgotPassword from '../screens/authScreens/OtpForgotPassword';
import ResetPassword from '../screens/authScreens/ResetPassword';
import ResetPasswordSuccess from '../screens/authScreens/ResetPasswordSucess';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator id="root" screenOptions={{ headerShown: false }}>

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
    </Stack.Navigator>
  );
}

export default RootNavigator;
