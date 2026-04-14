import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../components/Header';

// Settings screen SVG icons
import SoundAndVoiceIcon from '../assets/settingsScreen/sound_and_voice.svg';
import NavigationIcon from '../assets/settingsScreen/navigation.svg';
import AccessibilityIcon from '../assets/settingsScreen/accessibility.svg';
import DarkModeIcon from '../assets/settingsScreen/dark_mode.svg';
import FollowMyRideIcon from '../assets/settingsScreen/follow_my_ride.svg';
import EmergencyContactIcon from '../assets/settingsScreen/emergency_contact.svg';
import SpeedLimitIcon from '../assets/settingsScreen/speed_limit.svg';

const settingsData = [
  { id: 1, title: 'Sound and Voice', icon: SoundAndVoiceIcon, type: 'link', screen: 'SoundVoiceSettings' },
  { id: 2, title: 'Navigation', icon: NavigationIcon, type: 'link', screen: 'NavigationSettings' },
  { id: 3, title: 'Accessibility', icon: AccessibilityIcon, type: 'link', screen: 'AccessibilitySettings' },
  // { id: 5, title: 'Dark Mode', icon: DarkModeIcon, type: 'toggle', value: false },
  { id: 4, title: 'Emergency Contact', icon: EmergencyContactIcon, type: 'link', screen: 'EmergencyContact' },
];

const SettingsScreen = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const handleToggle = (id) => {
    if (id === 5) {
      toggleDarkMode(!isDarkMode);
    }
  };

  const renderSettingItem = (item) => {
    const Icon = item.icon;
    const isToggled = item.id === 5 ? isDarkMode : false;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { borderBottomColor: colors.divider }]}
        activeOpacity={0.7}
        onPress={() => {
          if (item.type === 'toggle') {
            handleToggle(item.id);
          } else if (item.screen) {
            navigation.navigate(item.screen);
          }
        }}
      >
        <View style={styles.settingLeft}>
          <Icon width={scale(22)} height={scale(22)} color={colors.textPrimary} stroke={colors.textPrimary} />
          <Text style={[styles.settingText, { color: colors.textPrimary }]}>
            {item.title}
          </Text>
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  settingText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.regular,
  },
});

export default SettingsScreen;
