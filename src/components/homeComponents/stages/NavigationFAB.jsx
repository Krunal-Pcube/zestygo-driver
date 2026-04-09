/**
 * NavigationFAB.jsx
 * Floating action button for navigation
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../../utils/colors';
import fonts from '../../../utils/fonts/fontsList';

export default function NavigationFAB({ onPress }) {
  return (
    <TouchableOpacity style={styles.navFab} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.navFabInner}>
        <Navigation size={moderateScale(18)} color={colors.white} />
        <Text style={styles.navFabText}>Navigation</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navFab: {
    position: 'absolute',
    bottom: verticalScale(120),
    right: scale(16),
    alignItems: 'center',
    zIndex: 0,
    elevation: 0,
  },
  navFabInner: {
    borderRadius: scale(12),
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  navFabText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    marginLeft: scale(4),
    color: colors.white,
    overflow: 'hidden',
  },
});
