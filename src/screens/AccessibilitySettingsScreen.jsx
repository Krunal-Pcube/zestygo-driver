import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Vibrate, Zap } from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../components/Header';

const AccessibilitySettingsScreen = ({ navigation }) => {
  // 2 Simple Toggles
  const [vibrationForRequest, setVibrationForRequest] = useState(true);
  const [screenFlashForRequest, setScreenFlashForRequest] = useState(false);

  const renderToggle = (icon, label, value, onChange) => (
    <TouchableOpacity
      style={styles.toggleRow}
      activeOpacity={0.7}
      onPress={() => onChange(!value)}
    >
      <View style={styles.toggleLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.toggleTextBox}>
          <Text style={styles.toggleLabel}>{label}</Text>
          <Text style={styles.toggleDesc}>When new order request comes</Text>
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
      <Header title="Accessibility" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* 1. Vibration for Request */}
        <View style={styles.card}>
          {renderToggle(
            <Vibrate size={22} color={colors.secondary} />,
            'Vibration',
            vibrationForRequest,
            setVibrationForRequest
          )}
        </View>

        {/* 2. Screen Flash for Request */}
        <View style={styles.card}>
          {renderToggle(
            <Zap size={22} color={colors.secondary} />,
            'Screen Flash',
            screenFlashForRequest,
            setScreenFlashForRequest
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
});

export default AccessibilitySettingsScreen;
