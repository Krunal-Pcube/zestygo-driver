import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Volume2, VolumeX, Navigation2, Bell } from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../components/Header';

const SoundVoiceSettingsScreen = ({ navigation }) => {
  // 3 Essential Settings for Delivery Drivers
  const [allSounds, setAllSounds] = useState(true);
  const [newOrderAlerts, setNewOrderAlerts] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(true);

  const renderToggle = (icon, label, value, onChange, description) => (
    <TouchableOpacity
      style={styles.toggleRow}
      activeOpacity={0.7}
      onPress={() => onChange(!value)}
    >
      <View style={styles.toggleLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.toggleTextBox}>
          <Text style={styles.toggleLabel}>{label}</Text>
          {description && <Text style={styles.toggleDesc}>{description}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#767577', true: colors.primary }}
        thumbColor={value ? colors.white : '#f4f3f4'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Sound & Voice" showBack={true}  />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* 1. All Sounds (Master Toggle) */}
        <View style={styles.card}>
          {renderToggle(
            allSounds ? (
              <Volume2 size={22} color={colors.secondary} />
            ) : (
              <VolumeX size={22} color={colors.grey} />
            ),
            'All Sounds',
            allSounds,
            setAllSounds,
            'Turn off to mute everything'
          )}
        </View>

        {/* 2. New Order Alerts */}
        <View style={[styles.card, !allSounds && styles.disabled]}>
          {renderToggle(
            <Bell size={22} color={allSounds ? colors.secondary : colors.grey} />,
            'New Order Alerts',
            allSounds && newOrderAlerts,
            setNewOrderAlerts,
            'Sound when new delivery request comes'
          )}
        </View>

    
    
     
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: verticalScale(20),
  },
  card: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(4),
  },
  disabled: {
    opacity: 0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(12),
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextBox: {
    marginLeft: scale(14),
    flex: 1,
  },
  toggleLabel: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
  },
  toggleDesc: {
    fontSize: moderateScale(12),
    fontFamily: fonts.regular,
    color: colors.grey,
    marginTop: verticalScale(3),
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    marginHorizontal: scale(16),
    marginTop: verticalScale(30),
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
  },
  testButtonText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  testButtonDisabled: {
    color: colors.grey,
  },
});

export default SoundVoiceSettingsScreen;
