import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
