import React, { useContext } from 'react';

import {

  View,

  Text,

  StyleSheet,

  TouchableOpacity,

  Switch,

  ScrollView,

  Modal,

  ActivityIndicator,

} from 'react-native';

import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

import fonts from '../utils/fonts/fontsList';

import { AuthContext } from '../MVC/context/AuthContext';

import { logoutAllDevices, logoutCurrentDevice } from '../MVC/Model/authApi';

import { getDeviceInfo } from '../utils/deviceInfo';

import Toast from 'react-native-toast-message';

import { colors } from '../utils/colors';



// Custom drawer icons

import EarningsIcon from '../assets/drawerIcons/earnings.svg';

import HistoryIcon from '../assets/drawerIcons/ic_round-work-history.svg';

import NotificationsIcon from '../assets/drawerIcons/zondicons_notification.svg';

import DocumentsIcon from '../assets/drawerIcons/famicons_documents.svg';

import HelpIcon from '../assets/drawerIcons/material-symbols_help.svg';

import SettingsIcon from '../assets/drawerIcons/material-symbols-light_settings-rounded.svg';

import LogoutIcon from '../assets/drawerIcons/majesticons_logout.svg';

import DrawerChevron from '../assets/drawerIcons/drawerchevron.svg';

import { User } from 'lucide-react-native';



const DrawerContent = (props) => {

  const { navigation } = props;

  const { logout } = useContext(AuthContext);



  const [onRideBooking, setOnRideBooking] = React.useState(true);

  const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

  const [loadingType, setLoadingType] = React.useState(null); // 'all' | 'current' | null



  const menuItems = [

    { name: 'Earnings', icon: EarningsIcon, label: 'Earnings' },

    { name: 'TripHistory', icon: HistoryIcon, label: 'History' },

    { name: 'Notifications', icon: NotificationsIcon, label: 'Notifications' },

    { name: 'Documents', icon: DocumentsIcon, label: 'Documents' },

    { name: 'Help', icon: HelpIcon, label: 'Help' },

    { name: 'Settings', icon: SettingsIcon, label: 'Settings' },

  ];



  // ─── Logout helpers ───────────────────────────────────────────────────────



  const finishLogout = async (successMsg, errorObj = null) => {

    await logout();



    Toast.show({

      type: errorObj ? 'error' : 'success',

      text1: errorObj ? 'Logged out' : successMsg,

      text2: errorObj?.message || undefined,

      position: 'top',

      topOffset: 50,

    });



    navigation.reset({

      index: 0,

      routes: [{ name: 'Login' }],

    });

  };



  const handleLogoutAllDevices = async () => {

    setLogoutModalVisible(false);

    setLoadingType('all');

    try {

      const res = await logoutAllDevices();

      await finishLogout(res?.data?.message);

    } catch (error) {

      await finishLogout(null, error);

    } finally {

      setLoadingType(null);

    }

  };



  const handleLogoutCurrentDevice = async () => {

    setLogoutModalVisible(false);

    setLoadingType('current');

    try {

      const deviceInfo = await getDeviceInfo();

      const res = await logoutCurrentDevice({

        device_type: deviceInfo.device_type,

        os_type: deviceInfo.os_type,

        device_name: deviceInfo.device_name,

      });

      await finishLogout(res?.data?.message);

    } catch (error) {

      await finishLogout(null, error);

    } finally {

      setLoadingType(null);

    }

  };



  // ─────────────────────────────────────────────────────────────────────────



  return (

    <>

      <ScrollView

        {...props}

        style={styles.container}

        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}

      >

        {/* Header */}

        <View style={styles.header}>

          <TouchableOpacity

            style={styles.backButton}

            onPress={() => navigation.closeDrawer()}

          >

            <DrawerChevron width={scale(20)} height={scale(18)} fill="#333" style={{ transform: [{ rotate: '180deg' }] }} />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>

        </View>



        {/* Profile Card */}

        <TouchableOpacity

          activeOpacity={0.7}

          style={styles.profileCard}

          onPress={() => navigation.navigate('Profile')}

        >

          <View style={styles.avatarContainer}>

            <User size={40} color="#666" />

          </View>

          <View style={styles.profileInfo}>

            <Text style={styles.profileName}>James Smith</Text>

            <Text style={styles.profilePhone}>+251 455 222 22</Text>

          </View>

          <DrawerChevron width={scale(18)} height={scale(18)} fill="#fff" />

        </TouchableOpacity>



        {/* Menu Items */}

        <View style={styles.menuContainer}>

          {menuItems.map((item, index) => (

            <TouchableOpacity

              key={index}

              style={styles.menuItem}

              onPress={() => navigation.navigate(item.name)}

            >

              <item.icon width={22} height={22} fill="#333" />

              <Text style={styles.menuLabel}>{item.label}</Text>

            </TouchableOpacity>

          ))}



          <TouchableOpacity

            style={styles.menuItem}

            onPress={() => setLogoutModalVisible(true)}

          >

            <LogoutIcon width={22} height={22} fill="#333" />

            <Text style={styles.menuLabel}>Logout</Text>

          </TouchableOpacity>

        </View>



        {/* ── Logout Bottom Sheet Modal ────────────────────────────────── */}

        <Modal

          animationType="slide"

          transparent={true}

          visible={logoutModalVisible}

          onRequestClose={() => setLogoutModalVisible(false)}

        >

          <View style={styles.modalOverlay}>

            <View style={styles.modalContainer}>

              <Text style={styles.modalTitle}>Logout</Text>

              <Text style={styles.modalSubtitle}>

                Choose how you want to log out

              </Text>



              <View style={styles.dividerLine} />



              {/* Logout All Devices */}

              <TouchableOpacity

                style={styles.yesButton}

                onPress={handleLogoutAllDevices}

                disabled={loadingType !== null}

              >

                <Text style={styles.yesButtonText}>Logout All Devices</Text>

              </TouchableOpacity>



              {/* Logout Current Device */}

              <TouchableOpacity

                style={styles.currentDeviceButton}

                onPress={handleLogoutCurrentDevice}

                disabled={loadingType !== null}

              >

                <Text style={styles.currentDeviceText}>

                  Logout Current Device

                </Text>

              </TouchableOpacity>



              {/* Cancel */}

              <TouchableOpacity

                style={styles.cancelButton}

                onPress={() => setLogoutModalVisible(false)}

                disabled={loadingType !== null}

              >

                <Text style={styles.cancelButtonText}>Cancel</Text>

              </TouchableOpacity>

            </View>

          </View>

        </Modal>



        <View style={styles.divider} />



        <View style={styles.toggleContainer}>

          <Text style={styles.toggleLabel}>On-Ride Booking</Text>

          <Switch

            value={onRideBooking}

            onValueChange={setOnRideBooking}

            trackColor={{ false: '#767577', true: '#4CAF50' }}

            thumbColor={onRideBooking ? '#fff' : '#f4f3f4'}

          />

        </View>

      </ScrollView>



      {/* ── Full-screen loader Modal — covers ENTIRE screen + drawer ─── */}

      <Modal

        visible={loadingType !== null}

        transparent={true}

        animationType="fade"

        statusBarTranslucent={true}

      >

        <View style={styles.loaderOverlay}>

          <View style={styles.loaderBox}>

            <ActivityIndicator size="large" color={colors.secondary} />

            <Text style={styles.loaderText}>Logging out...</Text>

          </View>

        </View>

      </Modal>

      {/* ─────────────────────────────────────────────────────────────── */}

    </>

  );

};



export default DrawerContent;



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#fff' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(12), paddingTop: verticalScale(12), paddingBottom: verticalScale(16) },

  backButton: { width: scale(40), height: scale(40), justifyContent: 'center' },

  headerTitle: { fontSize: moderateScale(18), fontFamily: fonts.semiBold, color: '#333', marginLeft: scale(8) },

  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C2C2C', paddingHorizontal: scale(16), paddingVertical: verticalScale(20), marginBottom: verticalScale(20) },

  avatarContainer: { width: scale(52), height: scale(52), borderRadius: scale(26), backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center', marginRight: scale(16) },

  profileInfo: { flex: 1 },

  profileName: { fontSize: moderateScale(16), fontFamily: fonts.semiBold, color: '#fff', marginBottom: verticalScale(2) },

  profilePhone: { fontSize: moderateScale(13), color: '#999' },

  menuContainer: { paddingHorizontal: scale(16) },

  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: verticalScale(14), gap: scale(16) },

  menuLabel: { fontSize: moderateScale(15), color: '#333', fontFamily: fonts.regular },

  divider: { height: 1, backgroundColor: '#E0E0E0', marginHorizontal: scale(16), marginVertical: verticalScale(12) },

  toggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(16), paddingVertical: verticalScale(8) },

  toggleLabel: { fontSize: moderateScale(14), color: '#333', fontFamily: fonts.regular },



  // Logout bottom sheet

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },

  modalContainer: { width: '100%', backgroundColor: '#fff', borderTopLeftRadius: moderateScale(24), borderTopRightRadius: moderateScale(24), paddingHorizontal: scale(20), paddingTop: verticalScale(24), paddingBottom: verticalScale(32), alignItems: 'center' },

  modalTitle: { fontSize: moderateScale(18), fontFamily: fonts.bold, color: '#1a1a1a', alignSelf: 'flex-start', marginBottom: verticalScale(4) },

  modalSubtitle: { fontSize: moderateScale(14), fontFamily: fonts.regular, color: '#666', alignSelf: 'flex-start', marginBottom: verticalScale(16) },

  dividerLine: { width: '100%', height: 1, backgroundColor: '#E0E0E0', marginBottom: verticalScale(16) },

  yesButton: { width: '100%', backgroundColor: '#1a1a1a', borderRadius: moderateScale(10), paddingVertical: verticalScale(14), alignItems: 'center', marginBottom: verticalScale(10) },

  yesButtonText: { fontSize: moderateScale(16), fontFamily: fonts.semiBold, color: colors.primary },

  currentDeviceButton: { width: '100%', backgroundColor: colors.secondary, borderRadius: moderateScale(10), paddingVertical: verticalScale(14), alignItems: 'center', marginBottom: verticalScale(10) },

  currentDeviceText: { fontSize: moderateScale(16), fontFamily: fonts.semiBold, color: colors.primary },

  cancelButton: { width: '100%', backgroundColor: '#D9D9D9', borderRadius: moderateScale(10), paddingVertical: verticalScale(14), alignItems: 'center' },

  cancelButtonText: { fontSize: moderateScale(16), fontFamily: fonts.semiBold, color: '#1a1a1a' },



  // Full-screen loader

  loaderOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },

  loaderBox: { backgroundColor: '#fff', paddingVertical: scale(24), paddingHorizontal: scale(32), borderRadius: moderateScale(14), alignItems: 'center', gap: scale(12) },

  loaderText: { fontSize: moderateScale(14), color: '#333', fontFamily: fonts.semiBold },

});