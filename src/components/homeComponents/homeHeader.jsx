import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import NotificationIcon from '../../assets/homeIcons/zondicons_notification.svg';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../MVC/context/AuthContext';
import { driverActiveSessionStatsController } from '../../MVC/controllers/driverEarningController';
import fonts from '../../utils/fonts/fontsList';

export default function HomeHeader({ navigation, notificationCount = 0 }) {
  const { colors } = useTheme();
  const { auth } = useAuth();
  const [totalEarnings, setTotalEarnings] = useState(0);
 
  useEffect(() => {
    const fetchSessionStats = async () => {
      const deliveryPartnerID = auth?.delivery_partner_id;

      if (!deliveryPartnerID) {
        return;
      }

      await driverActiveSessionStatsController({
        deliveryPartnerID,
        onSuccess: (data) => {
          setTotalEarnings(data?.total_earnings);
        },
      });
    };

    fetchSessionStats();
  }, [auth]);

  return (
    <View style={[styles.header, { backgroundColor: colors.white }]}>
      {/* Left: Menu */}
      <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={() => navigation?.openDrawer()}>
        <Image source={require('../../assets/homeIcons/Menu.png')} style={[styles.menuIcon, { tintColor: colors.secondary }]} />
      </TouchableOpacity>

      {/* Center: Earnings Pill */}
      <TouchableOpacity
        style={[styles.earPill, { backgroundColor: colors.secondary, shadowColor: colors.black }]}
        activeOpacity={0.8}
        onPress={() => navigation?.navigate('Earnings')}
      >
        <Text style={[styles.earVal, { color: colors.white }]}>$ {totalEarnings.toFixed(2)}</Text>
      </TouchableOpacity>

      {/* Right: Notification */}
      <TouchableOpacity 
        style={styles.iconBtn} 
        activeOpacity={0.7}
        onPress={() => navigation?.navigate('Notifications')}
      >
        <NotificationIcon width={moderateScale(24)} height={moderateScale(24)} stroke={colors.secondary} />
        {notificationCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: colors.secondary }]}>
            <Text style={[styles.badgeText, { color: colors.secondary }]}>
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
    zIndex: 20,
  },
  iconBtn: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  earPill: {
    borderRadius: scale(12),
    paddingHorizontal: scale(26),
    paddingVertical: verticalScale(8),
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  earVal: {
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(4),
    borderWidth: 1,
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontFamily: fonts.bold,
  },
  menuIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
    resizeMode: 'contain',
  },
});
