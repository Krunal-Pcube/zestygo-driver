import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="notifications-outline" size={24} color="#4A90D9" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{false: '#D3D3D3', true: '#4A90D9'}}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="moon-outline" size={24} color="#4A90D9" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{false: '#D3D3D3', true: '#4A90D9'}}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="car-outline" size={24} color="#4A90D9" />
              <Text style={styles.settingText}>Auto Accept Rides</Text>
            </View>
            <Switch
              value={autoAccept}
              onValueChange={setAutoAccept}
              trackColor={{false: '#D3D3D3', true: '#4A90D9'}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="help-circle-outline" size={24} color="#4A90D9" />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="chatbubble-outline" size={24} color="#4A90D9" />
              <Text style={styles.settingText}>Contact Support</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="document-text-outline" size={24} color="#4A90D9" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="shield-outline" size={24} color="#4A90D9" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

export default SettingsScreen;
