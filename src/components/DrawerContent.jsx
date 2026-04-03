import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {User, Wallet, History, Settings, LogOut, Home} from 'lucide-react-native';

function DrawerContent(props) {
  const {navigation} = props;
 
  const menuItems = [
    {name: 'Home', icon: Home, label: 'Home'},
    {name: 'Profile', icon: User, label: 'Profile'},
    {name: 'Earnings', icon: Wallet, label: 'Earnings'},
    {name: 'TripHistory', icon: History, label: 'Trip History'},
    {name: 'Settings', icon: Settings, label: 'Settings'},
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* Driver Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color="#666" />
          </View>
        </View>
        <Text style={styles.driverName}>John Driver</Text>
        <Text style={styles.driverInfo}>4.75 ★ | 1,234 trips</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.name)}>
            <item.icon size={24} color="#333" />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={24} color="#E74C3C" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  header: { 
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  }, 
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  driverInfo: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#E74C3C',
    fontWeight: '500',
  },
});

export default DrawerContent;
