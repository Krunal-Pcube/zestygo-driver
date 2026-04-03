import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,  
  ScrollView, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import {
  Bike, User, Mail, Phone, Lock, Eye, EyeOff,
  UserPlus, ChevronDown,
} from 'lucide-react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { colors } from '../../utils/colors';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [phone, setPhone]                 = useState('');
  const [password, setPassword]           = useState('');
  const [hidePassword, setHidePassword]   = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [callingCode, setCallingCode]     = useState('+91');
  const [countryFlag, setCountryFlag]     = useState('🇮🇳');

  return (
    <View style={styles.safe}>

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.badge}>
          <Bike size={32} color={colors.secondary} strokeWidth={2} />
        </View>
        <Text style={styles.heroTitle}>Create Account</Text>
        <Text style={styles.heroSub}>Start your journey as a delivery partner</Text>
      </View>

      {/* ── Form ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sheet}>

            {/* ── Full Name ── */}
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}>
                <User size={18} color={colors.muted} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor={colors.placeholder}
                value={fullName}
                onChangeText={setFullName}
                returnKeyType="next"
              />
            </View>

            {/* ── Email ── */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Email Address</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}>
                <Mail size={18} color={colors.muted} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            {/* ── Phone ── */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Mobile Number</Text>
            <View style={styles.mobileRow}>
              <TouchableOpacity
                style={styles.countryTrigger}
                onPress={() => setPickerVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.flagEmoji}>{countryFlag}</Text>
                <Text style={styles.callingCode}>{callingCode}</Text>
                <ChevronDown size={14} color={colors.muted} strokeWidth={2.5} />
              </TouchableOpacity>
              <TextInput
                style={styles.mobileInput}
                placeholder="Enter mobile number"
                placeholderTextColor={colors.placeholder}
                value={phone}
                onChangeText={(v) => setPhone(v.replace(/[^0-9]/g, '').slice(0, 10))}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="next"
              />
            </View>

            {/* ── Password ── */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}>
                <Lock size={18} color={colors.muted} strokeWidth={2} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePassword}
                autoCapitalize="none"
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setHidePassword(!hidePassword)}
                activeOpacity={0.7}
              >
                {hidePassword
                  ? <Eye size={20} color={colors.muted} strokeWidth={2} />
                  : <EyeOff size={20} color={colors.muted} strokeWidth={2} />}
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordHint}>
              Must be at least 8 characters with a mix of letters and numbers
            </Text>

            {/* ── Sign Up CTA ── */}
            <TouchableOpacity
              style={styles.ctaBtn}
              activeOpacity={0.85}
            >
              <UserPlus size={18} color={colors.secondary} strokeWidth={2.5} />
              <Text style={styles.ctaText}>Sign Up</Text>
            </TouchableOpacity>

            {/* ── Login Link ── */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation?.navigate('Login')}
              >
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>



            {/* ── Footer ── */}
            <Text style={styles.footerNote}>
              By continuing, you agree to our{' '}
              <Text style={styles.footerLink}>Terms & Conditions</Text>
              {' '}and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </Text>

          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Country Picker ── */}
      <CountryPicker
        show={pickerVisible}
        pickerButtonOnPress={(item) => {
          setCallingCode(item.dial_code);
          setCountryFlag(item.flag);
          setPickerVisible(false);
        }}
        onBackdropPress={() => setPickerVisible(false)}
        lang="en"
        style={{
          modal: {
            height: '65%',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: colors.white,
          },
          backdrop: { backgroundColor: 'rgba(0,0,0,0.45)' },
          line: { backgroundColor: colors.divider },
          itemsList: { paddingHorizontal: 4 },
          textInput: {
            height: 46,
            borderRadius: 12,
            paddingHorizontal: 14,
            backgroundColor: colors.inputBg,
            borderWidth: 1.5,
            borderColor: colors.inputBorder,
            fontSize: 14,
            color: colors.secondary,
          },
          countryButtonStyles: {
            height: 52,
            borderRadius: 12,
            marginBottom: 4,
            backgroundColor: colors.white,
          },
          searchMessageText: { color: colors.muted, fontSize: 14 },
          countryMessageContainer: { paddingVertical: 24, alignItems: 'center' },
          flag: { fontSize: 22, marginRight: 8 },
          dialCode: { fontSize: 14, fontWeight: '700', color: colors.secondary },
          countryName: { fontSize: 14, color: colors.secondary },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colors.secondary,
    paddingTop: 28, paddingBottom: 32, paddingHorizontal: 24, overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(207,255,4,0.07)', top: -70, right: -60,
  },
  blob2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(207,255,4,0.05)', bottom: 0, left: -40,
  },
  badge: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
  },
  heroTitle: {
    fontSize: 30, fontWeight: '900', color: colors.white, letterSpacing: -0.5, marginBottom: 4,
  },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },

  // ── Sheet ─────────────────────────────────────────────────────────────────
  scrollContent: { flexGrow: 1 },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20,
  },

  // ── Field Label ───────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 12, fontWeight: '700', color: '#555',
    letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8,
  },

  // ── Input Row ─────────────────────────────────────────────────────────────
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.inputBorder, overflow: 'hidden',
  },
  inputIconBox: {
    paddingHorizontal: 14, paddingVertical: 15,
    borderRightWidth: 1.5, borderRightColor: colors.inputBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 15,
    fontSize: 15, color: colors.secondary,
  },
  eyeBtn: { paddingHorizontal: 14, paddingVertical: 14 },

  // ── Mobile Row ────────────────────────────────────────────────────────────
  mobileRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.inputBorder, overflow: 'hidden',
  },
  countryTrigger: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 15,
    borderRightWidth: 1.5, borderRightColor: colors.inputBorder,
  },
  flagEmoji: { fontSize: 20 },
  callingCode: { fontSize: 15, fontWeight: '700', color: colors.secondary },
  mobileInput: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 15,
    fontSize: 16, color: colors.secondary, fontWeight: '600', letterSpacing: 1.5,
  },

  // ── Password Hint ─────────────────────────────────────────────────────────
  passwordHint: {
    fontSize: 11, color: colors.muted, textAlign: 'center',
    marginTop: 8, lineHeight: 16,
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 17, marginTop: 24,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 7,
  },
  ctaText: { color: colors.secondary, fontSize: 16, fontWeight: '900', letterSpacing: 0.4 },

  // ── Login Link ────────────────────────────────────────────────────────────
  loginRow: {
    flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 4,
  },
  loginText: { fontSize: 13, color: '#666' },
  loginLink: { fontSize: 13, fontWeight: '700', color: colors.secondary, textDecorationLine: 'underline' },

  // ── Divider ───────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerLabel: { marginHorizontal: 12, fontSize: 12, fontWeight: '700', color: '#CCCCCC' },

  // ── Social Buttons ────────────────────────────────────────────────────────
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.inputBg, borderRadius: 16, paddingVertical: 15,
    borderWidth: 1.5, borderColor: colors.inputBorder,
  },
  appleIcon: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  socialBtnText: { fontSize: 15, fontWeight: '700', color: colors.secondary },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerNote: {
    fontSize: 11, color: '#BBBBBB', textAlign: 'center', marginTop: 20, lineHeight: 17,
  },
  footerLink: { color: colors.secondary, fontWeight: '700' },
});

export default SignupScreen;