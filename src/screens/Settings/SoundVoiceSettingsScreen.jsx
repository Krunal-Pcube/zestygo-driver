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
import { useTheme } from '../../context/ThemeContext';
import fonts from '../../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/Header';

const SoundVoiceSettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
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
        <View style={[styles.iconBox, { backgroundColor: colors.background }]}>{icon}</View>
        <View style={styles.toggleTextBox}>
          <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>{label}</Text>
          {description && <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>{description}</Text>}
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Sound & Voice" showBack={true}  />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* 1. All Sounds (Master Toggle) */}
        {/* <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {renderToggle(
            allSounds ? (
              <Volume2 size={22} color={colors.textPrimary} />
            ) : (
              <VolumeX size={22} color={colors.grey} />
            ),
            'All Sounds',
            allSounds,
            setAllSounds,
            'Turn off to mute everything'
          )}
        </View> */}

        {/* 2. New Order Alerts */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }, !allSounds && styles.disabled]}>
          {renderToggle(
            <Bell size={22} color={allSounds ? colors.textPrimary : colors.grey} />,
            'New Order Alerts',
            allSounds && newOrderAlerts,
            setNewOrderAlerts,
            'Sound when new delivery request comes'
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: verticalScale(20),
  },
  card: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
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
  },
  toggleDesc: {
    fontSize: moderateScale(12),
    fontFamily: fonts.regular,
    marginTop: verticalScale(3),
  },
});

export default SoundVoiceSettingsScreen;
