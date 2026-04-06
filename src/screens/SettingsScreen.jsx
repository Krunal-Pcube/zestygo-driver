import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import {
  Volume2,
  Navigation,
  Accessibility,
  Globe,
  Moon,
  MapPin,
  Phone,
  Gauge,
  ChevronRight,
} from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

const settingsData = [
  { id: 1, title: 'Sound and Voice', icon: Volume2, type: 'toggle', value: true },
  { id: 2, title: 'Navigation', icon: Navigation, type: 'link' },
  { id: 3, title: 'Accessibility', icon: Accessibility, type: 'link' },
  { id: 4, title: 'App Language', icon: Globe, type: 'link' },
  { id: 5, title: 'Dark Mode', icon: Moon, type: 'toggle', value: false },
  { id: 6, title: 'Follow my ride', icon: MapPin, type: 'link' },
  { id: 7, title: 'Emergency Contact', icon: Phone, type: 'link' },
  { id: 8, title: 'Speed Limit', icon: Gauge, type: 'link' },
];

const SettingsScreen = ({ navigation }) => {
  const [toggles, setToggles] = useState({
    1: true,
    5: false,
  });

  const handleToggle = (id) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSettingItem = (item) => {
    const Icon = item.icon;
    const isToggled = toggles[item.id];

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        activeOpacity={0.7}
        onPress={() => {
          if (item.type === 'toggle') {
            handleToggle(item.id);
          }
        }}
      >
        <View style={styles.settingLeft}>
          <Icon size={22} color={colors.darkText} strokeWidth={1.5} />
          <Text style={styles.settingText}>{item.title}</Text>
        </View>
        {item.type === 'toggle' ? (
          <Switch
            value={isToggled}
            onValueChange={() => handleToggle(item.id)}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={isToggled ? colors.white : '#f4f3f4'}
          />
        ) : (
          <ChevronRight size={20} color={colors.grey} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsData.map((item) => renderSettingItem(item))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  settingText: {
    fontSize: moderateScale(15),
    color: colors.darkText,
    fontFamily: fonts.regular,
  },
});

export default SettingsScreen;
