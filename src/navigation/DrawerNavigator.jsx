import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Drawer/ProfileScreen';
import EarningsStackNavigator from './EarningsStackNavigator';
import TripHistoryScreen from '../screens/Drawer/TripHistoryScreen';
import SettingsScreen from '../screens/Drawer/SettingsScreen';
import HelpScreen from '../screens/Drawer/HelpScreen';
import DocumentsScreen from '../screens/Drawer/DocumentsScreen';
import NotificationsScreen from '../screens/Settings/NotificationsScreen';
import DrawerContent from '../components/DrawerContent';
import { scale } from 'react-native-size-matters';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '82%',
          marginTop: scale(14),
          
        },
      }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Earnings" component={EarningsStackNavigator} />
      <Drawer.Screen name="TripHistory" component={TripHistoryScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
      <Drawer.Screen name="Documents" component={DocumentsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
