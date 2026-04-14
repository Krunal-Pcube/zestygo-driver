import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Bell, Package, DollarSign, Info, ChevronRight } from 'lucide-react-native';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList';
import { scale, moderateScale } from 'react-native-size-matters';
import Header from '../../components/Header';

const notificationsData = [
  {
    id: 1,
    title: 'New Order Request',
    message: 'You have a new delivery order from Dave\'s Hot Chicken',
    time: '2 min ago',
    type: 'order',
    unread: true,
  },
  {
    id: 2,
    title: 'Payment Received',
    message: '$18.05 has been added to your wallet for Order #230203',
    time: '1 hour ago',
    type: 'payment',
    unread: true,
  },
  {
    id: 3,
    title: 'Weekly Summary',
    message: 'You earned $542 this week. Great job!',
    time: 'Yesterday',
    type: 'info',
    unread: false,
  },
  {
    id: 4,
    title: 'Account Verified',
    message: 'Your driving license has been verified successfully',
    time: '2 days ago',
    type: 'info',
    unread: false,
  },
  {
    id: 5,
    title: 'New Bonus Available',
    message: 'Complete 10 more trips to earn $50 bonus',
    time: '3 days ago',
    type: 'payment',
    unread: false,
  },
];

const getIcon = (type) => {
  switch (type) {
    case 'order':
      return <Package size={20} color={colors.white} />;
    case 'payment':
      return <DollarSign size={20} color={colors.white} />;
    case 'info':
    default:
      return <Info size={20} color={colors.white} />;
  } 
};

const NotificationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header title="Notifications" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {notificationsData.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationItem, notification.unread && styles.unreadItem]}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {getIcon(notification.type)}
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.headerRow}>
                <Text style={[styles.notificationTitle, notification.unread && styles.unreadTitle]}>
                  {notification.title}
                </Text>
                <Text style={styles.timeText}>{notification.time}</Text>
              </View>
              <Text style={styles.notificationMessage} numberOfLines={2}>
                {notification.message}
              </Text>
            </View>
            {notification.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  unreadItem: {
    backgroundColor: colors.veryLightGrey,
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: colors.divider,
  },
  notificationContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  notificationTitle: {
    fontSize: moderateScale(15),
    fontFamily: fonts.medium,
    color: colors.darkText,
    flex: 1,
  },
  unreadTitle: {
    fontFamily: fonts.bold,
  },
  timeText: {
    fontSize: moderateScale(12),
    color: colors.grey,
  },
  notificationMessage: {
    fontSize: moderateScale(13),
    color: colors.mediumGrey,
    lineHeight: moderateScale(18),
  },
  unreadDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: colors.primary,
    marginLeft: scale(8),
    marginTop: scale(6),
  },
});

export default NotificationsScreen;
