import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform, 
  Linking,
  Modal,
} from 'react-native';
import { Phone, User, Heart, Shield, Flame, Siren } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import fonts from '../../utils/fonts/fontsList';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/Header';
import { colors } from '../../utils/colors';

const EmergencyContactScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const isValid = name.trim() && phone.trim().length >= 10;

  const emergencyNumbers = [
    { icon: <Siren size={22} color={colors.primary} />, label: 'Emergency', number: '911' },
    { icon: <Shield size={22} color={colors.primary} />, label: 'Non-Emergency', number: '311' },
    { icon: <Flame size={22} color={colors.primary} />, label: 'Road Conditions', number: '511' },
    { icon: <Heart size={22} color={colors.primary} />, label: 'Poison Control', number: '1-800-268-9017' },
  ];

  const handleEmergencyCall = (item) => {
    setSelectedEmergency(item);
    setShowCallModal(true);
  };

  const confirmCall = () => {
    if (selectedEmergency) {
      Linking.openURL(`tel:${selectedEmergency.number}`);
    }
    setShowCallModal(false);
    setSelectedEmergency(null);
  };

  const cancelCall = () => {
    setShowCallModal(false);
    setSelectedEmergency(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Emergency Contact" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
    
        {/* Emergency Services Section */}
        <Text style={[styles.emergencySectionTitle, { color: colors.grey }]}>Emergency Services</Text>
        <View style={styles.emergencyGrid}>
          {emergencyNumbers.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.emergencyButton, { backgroundColor: colors.secondary }]}
              onPress={() => handleEmergencyCall(item)}
              activeOpacity={0.8}
            >
              {item.icon}
              <Text style={[styles.emergencyLabel, { color: colors.white }]}>{item.label}</Text>
              <Text style={[styles.emergencyNumber, { color: colors.white }]}>{item.number}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.emergencyNote}>
          Tap any button to call emergency services immediately
        </Text>
      </ScrollView>

      {/* Custom Call Confirmation Modal */}
      <Modal
        visible={showCallModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelCall}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.secondary }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: colors.secondary }]}>
              {selectedEmergency?.icon}
            </View>
            
            <Text style={[styles.modalTitle, { color: colors.white }]}>
              Call {selectedEmergency?.label}?
            </Text>
            
            <Text style={[styles.modalNumber, { color: colors.primary }]}>
              {selectedEmergency?.number}
            </Text>
            
            <Text style={[styles.modalDescription, { color: colors.lightgrey }]}>
              This will open your phone app and dial this number immediately.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: colors.white }]}
                onPress={cancelCall}
              >
                <Text style={[styles.cancelButtonText, { color: colors.white }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.callButton, { backgroundColor: colors.primary }]}
                onPress={confirmCall}
              >
                <Phone size={18} color={colors.secondary} />
                <Text style={[styles.callButtonText, { color: colors.secondary }]}>Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: verticalScale(20),
  },
  infoCard: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(20),
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(13),
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
  inputCard: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
    borderRadius: scale(12),
    padding: scale(16),
  },
  label: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    marginBottom: verticalScale(10),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    fontFamily: fonts.regular,
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
  },
  saveButton: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#EDEDED',
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
  },
  saveButtonTextDisabled: {
    color: '#767774',
  },
  emergencySectionTitle: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: scale(16),
    gap: scale(10),
  },
  emergencyButton: {
    width: (scale(360) - scale(52)) / 2,
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    alignItems: 'center',
    gap: verticalScale(6),
  },
  emergencyLabel: {
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    marginTop: verticalScale(4),
  },
  emergencyNumber: {
    fontSize: moderateScale(16),
    fontFamily: fonts.bold,
  },
  emergencyNote: {
    fontSize: moderateScale(11),
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(30),
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  modalContainer: {
    width: '100%',
    borderRadius: scale(20),
    padding: scale(24),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalIconContainer: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: fonts.bold,
    marginBottom: verticalScale(8),
  },
  modalNumber: {
    fontSize: moderateScale(28),
    fontFamily: fonts.bold,
    marginBottom: verticalScale(12),
  },
  modalDescription: {
    fontSize: moderateScale(13),
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: moderateScale(18),
  },
  modalButtons: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
  },
  callButton: {
    flexDirection: 'row',
    gap: scale(8),
  },
  callButtonText: {
    fontSize: moderateScale(15),
    fontFamily: fonts.bold,
  },
});

export default EmergencyContactScreen;
