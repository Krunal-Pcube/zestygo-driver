import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import NotificationIcon from '../../assets/homeIcons/zondicons_notification.svg';
import MenuIcon from '../../assets/homeIcons/Menu.svg';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';

export default function HomeHeader({ navigation, earnings = 0, notificationCount = 0 }) {
  return (
    <View style={styles.header}>
      {/* Left: Menu */}
      <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={() => navigation?.openDrawer()}>
        <MenuIcon width={moderateScale(28)} height={moderateScale(28)} fill={colors.secondary} />
      </TouchableOpacity>

      {/* Center: Earnings Pill */}
      <TouchableOpacity
        style={styles.earPill}
        activeOpacity={0.8}
        onPress={() => navigation?.navigate('Earnings')}
      >
        <Text style={styles.earVal}>$ {earnings.toFixed(2)}</Text>
      </TouchableOpacity>

      {/* Right: Notification */}
      <TouchableOpacity 
        style={styles.iconBtn} 
        activeOpacity={0.7}
        onPress={() => navigation?.navigate('Notifications')}
      >
        <NotificationIcon width={moderateScale(24)} height={moderateScale(24)} fill={colors.secondary} />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Text>
          </View>
        )}
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
    fontFamily: fonts.bold,
    letterSpacing: 0.4,
  },
  badge: {
    position: 'absolute',
    top: verticalScale(4),
    right: scale(4),
    minWidth: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(4),
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  badgeText: {
    color: colors.secondary,
    fontSize: moderateScale(10),
    fontFamily: fonts.bold,
  },
});
