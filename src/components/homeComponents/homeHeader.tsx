import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Menu, Bell } from 'lucide-react-native';
import { colors } from '../../utils/colors';

interface HomeHeaderProps {
  navigation?: any;
  earnings?: number;
}

export default function HomeHeader({ navigation, earnings = 0 }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Left: Menu */}
      <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.openDrawer()}>
        <Menu size={moderateScale(22)} color={colors.secondary} />
      </TouchableOpacity>

      {/* Center: Earnings Pill */}
      <View style={styles.earPill}>
        <Text style={styles.earVal}>$ {earnings.toFixed(2)}</Text>
      </View>

      {/* Right: Bell */}
      <TouchableOpacity style={styles.iconBtn}>
        <Bell size={moderateScale(22)} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    zIndex: 20,
  },
  iconBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earPill: {
    backgroundColor: colors.secondary,
    borderRadius: scale(12),
    paddingHorizontal: scale(26),
    paddingVertical: verticalScale(8),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  earVal: {
    color: colors.white,
    fontSize: moderateScale(18),
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
