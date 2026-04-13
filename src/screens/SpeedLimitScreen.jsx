import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Gauge, AlertTriangle, BellOff } from 'lucide-react-native';
import { colors } from '../utils/colors';
import fonts from '../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../components/Header';

const SpeedLimitScreen = ({ navigation }) => {
  const [speedAlerts, setSpeedAlerts] = useState(true);
  const [selectedLimit, setSelectedLimit] = useState(80);

  const speedOptions = [60, 80, 100, 120];

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
          <Text style={styles.toggleDesc}>
            Alert when you exceed speed limit
          </Text>
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
      <Header title="Speed Limit" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Speed Alert Toggle */}
        <View style={styles.card}>
          {renderToggle(
            <AlertTriangle size={22} color={colors.secondary} />,
            'Speed Alerts',
            speedAlerts,
            setSpeedAlerts
          )}
        </View>

        {/* Speed Limit Selection */}
        {speedAlerts && (
          <>
            <Text style={styles.sectionTitle}>Set Speed Limit (km/h)</Text>

            <View style={styles.card}>
              <View style={styles.speedGrid}>
                {speedOptions.map((speed) => (
                  <TouchableOpacity
                    key={speed}
                    style={[
                      styles.speedButton,
                      selectedLimit === speed && styles.speedButtonActive,
                    ]}
                    onPress={() => setSelectedLimit(speed)}
                    activeOpacity={0.7}
                  >
                    <Gauge
                      size={24}
                      color={
                        selectedLimit === speed
                          ? colors.white
                          : colors.grey
                      }
                    />
                    <Text
                      style={[
                        styles.speedText,
                        selectedLimit === speed && styles.speedTextActive,
                      ]}
                    >
                      {speed}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Selected Info */}
            <View style={styles.infoCard}>
              <BellOff size={20} color={colors.grey} />
              <Text style={styles.infoText}>
                You will be alerted when speed exceeds {selectedLimit} km/h
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default SpeedLimitScreen;

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

  sectionTitle: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
  },

  // ✅ FIXED GRID (2 columns)
  speedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: scale(12),
  },

  speedButton: {
    width: '48%', // ✅ 2 columns responsive
    height: verticalScale(80),
    backgroundColor: colors.background,
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },

  speedButtonActive: {
    backgroundColor: colors.secondary,
  },

  speedText: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
    color: colors.grey,
  },

  speedTextActive: {
    color: colors.white,
  },

  infoCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    flex: 1,
    fontSize: moderateScale(13),
    fontFamily: fonts.regular,
    color: colors.darkText,
    lineHeight: 20,
    marginLeft: scale(10),
  },
});