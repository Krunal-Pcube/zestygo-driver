import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Vibrate, Zap } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { getVibrationSetting, setVibrationSetting, getScreenFlashSetting, setScreenFlashSetting } from '../../utils/accessibilityStorage';
import fonts from '../../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/Header';

const AccessibilitySettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();

  // 2 Simple Toggles
  const [vibrationForRequest, setVibrationForRequest] = useState(true);
  const [screenFlashForRequest, setScreenFlashForRequest] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const vibration = await getVibrationSetting();
      const screenFlash = await getScreenFlashSetting();
      setVibrationForRequest(vibration);
      setScreenFlashForRequest(screenFlash);
    };
    loadSettings();
  }, []);

  // Save vibration setting
  const handleVibrationChange = async (value) => {
    setVibrationForRequest(value);
    await setVibrationSetting(value);
  };

  // Save screen flash setting
  const handleScreenFlashChange = async (value) => {
    setScreenFlashForRequest(value);
    await setScreenFlashSetting(value);
  };

  const renderToggle = (icon, label, value, onChange) => (
    <TouchableOpacity
      style={styles.toggleRow}
      activeOpacity={0.7}
      onPress={() => onChange(!value)}
    >
      <View style={styles.toggleLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.background }]}>{icon}</View>
        <View style={styles.toggleTextBox}>
          <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>{label}</Text>
          <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>When new order request comes</Text>
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
      <Header title="Accessibility" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* 1. Vibration for Request */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {renderToggle(
            <Vibrate size={22} color={colors.textPrimary} />,
            'Vibration',
            vibrationForRequest,
            handleVibrationChange
          )}
        </View>

        {/* 2. Screen Flash for Request */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          {renderToggle(
            <Zap size={22} color={colors.textPrimary} />,
            'Screen Flash',
            screenFlashForRequest,
            handleScreenFlashChange
          )}
        </View>
      </ScrollView>
    </View>
  );
};

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

export default AccessibilitySettingsScreen;
