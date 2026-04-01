import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Icon name="person-circle" size={100} color="#4A90D9" />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
        <Text style={styles.phone}>+1 234 567 890</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileScreen;
