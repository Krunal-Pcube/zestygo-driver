import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Navigation2, MapPin, Compass, Eye } from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../components/Header';

const NavigationSettingsScreen = ({ navigation }) => {
  // 3 Essential Navigation Settings
  const [autoNavigate, setAutoNavigate] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);
  const [northLock, setNorthLock] = useState(false);

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

  const renderOption = (label, selected, onSelect) => (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Navigation" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Map Preferences */}
        <Text style={styles.sectionTitle}>Map Preferences</Text>

        {/* 1. Auto-Navigate */}
        <View style={styles.card}>
          {renderToggle(
            <Navigation2 size={22} color={colors.secondary} />,
            'Auto-Navigate',
            autoNavigate,
            setAutoNavigate,
            'Start navigation automatically on new trip'
          )}
        </View>

  

   

        {/* Navigation Provider */}
        <Text style={[styles.sectionTitle, { marginTop: verticalScale(24) }]}>
          Navigation App
        </Text>
        
        <View style={styles.card}>
          <TouchableOpacity style={styles.navAppRow} activeOpacity={0.7}>
            <View style={styles.navAppLeft}>
              <MapPin size={20} color={colors.secondary} />
              <Text style={styles.navAppText}>Google Maps</Text>
            </View>
            <Text style={styles.navAppSubtext}>Default</Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
    marginTop: verticalScale(8),
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
  optionsRow: {
    flexDirection: 'row',
    gap: scale(10),
    paddingHorizontal: scale(12),
    paddingBottom: scale(12),
    marginTop: verticalScale(4),
  },
  option: {
    flex: 1,
    paddingVertical: verticalScale(10),
    backgroundColor: colors.background,
    borderRadius: scale(8),
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.veryLightGrey,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.medium,
    color: colors.grey,
  },
  optionTextSelected: {
    color: colors.white,
    fontFamily: fonts.semiBold,
  },
  navAppRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(12),
  },
  navAppLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
  },
  navAppText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
    color: colors.secondary,
  },
  navAppSubtext: {
    fontSize: moderateScale(12),
    fontFamily: fonts.regular,
    color: colors.grey,
  },
});

export default NavigationSettingsScreen;
