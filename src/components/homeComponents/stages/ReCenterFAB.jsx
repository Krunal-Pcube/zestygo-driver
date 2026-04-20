/**
 * ReCenterFAB.jsx
 * Floating action button to re-center map and re-route
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LocateFixed } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../../../utils/colors';
import fonts from '../../../utils/fonts/fontsList';
 
export default function ReCenterFAB({ onPress }) {
  return (
    <TouchableOpacity style={styles.recenterFab} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.recenterFabInner}>
        <LocateFixed size={moderateScale(18)} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recenterFab: {
    position: 'absolute',
    bottom: verticalScale(120),
    left: scale(16),  // Left side instead of right
    alignItems: 'center',
    zIndex: 0,
    elevation: 0,
  },
  recenterFabInner: {
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
  recenterFabText: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    marginLeft: scale(4),
    color: colors.white,
    overflow: 'hidden',
  },
});