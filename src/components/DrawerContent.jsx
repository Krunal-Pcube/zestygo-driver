import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Wallet,
  History,
  Bell,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react-native';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import fonts from '../utils/fonts/fontsList'; 

const DrawerContent = (props) => {
  const { navigation } = props;
  const [onRideBooking, setOnRideBooking] = React.useState(true);

  const menuItems = [
    { name: 'Earnings', icon: Wallet, label: 'Earnings' },
    { name: 'TripHistory', icon: History, label: 'History' },
    { name: 'Notifications', icon: Bell, label: 'Notifications' },
    { name: 'Documents', icon: FileText, label: 'Documents' },
    { name: 'Help', icon: HelpCircle, label: 'Help' },
    { name: 'Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <ScrollView {...props} style={styles.container} contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }} >
      {/* Header with Profile title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.closeDrawer()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Full-width Profile Card - Dark */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.profileCard}
        onPress={() => navigation.navigate('Profile')}>
        <View style={styles.avatarContainer}>
          <User size={40} color="#666" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>James Smith</Text>
          <Text style={styles.profilePhone}>+251 455 222 22</Text>
        </View>
        <ChevronRight size={24} color="#fff" />
      </TouchableOpacity>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.name)}>
            <item.icon size={22} color="#333" strokeWidth={1.5} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.menuItem}>
          <LogOut size={22} color="#333" strokeWidth={1.5} />
          <Text style={styles.menuLabel}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* On-Ride Booking Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>On-Ride Booking</Text>
        <Switch
          value={onRideBooking}
          onValueChange={setOnRideBooking}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={onRideBooking ? '#fff' : '#f4f3f4'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: moderateScale(24),
    color: '#333',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: fonts.semiBold,
    color: '#333',
  },
  placeholder: {
    width: scale(40),
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    marginHorizontal: 0,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
    borderRadius: 0,
    marginBottom: verticalScale(20),
  },
  avatarContainer: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(16),
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: moderateScale(16),
    fontFamily: fonts.semiBold,
    color: '#fff',
    marginBottom: verticalScale(2),
  },
  profilePhone: {
    fontSize: moderateScale(13),
    color: '#999',
  },
  menuContainer: {
    paddingHorizontal: scale(16),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    gap: scale(16),
  },
  menuLabel: {
    fontSize: moderateScale(15),
    color: '#333',
    fontFamily: fonts.regular,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: scale(16),
    marginVertical: verticalScale(12),
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },
  toggleLabel: {
    fontSize: moderateScale(14),
    color: '#333',
    fontFamily: fonts.regular,
  },
});

export default DrawerContent;
