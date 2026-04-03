

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  Bike, Smartphone, Lock, Eye, EyeOff,
  Send, LogIn, ChevronDown, UserPlus,
} from 'lucide-react-native'; 
import { CountryPicker } from 'react-native-country-codes-picker';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';

const LoginScreen = () => {
  const [loginType, setLoginType]         = useState('OTP');
  const [mobile, setMobile]               = useState('');
  const [password, setPassword]           = useState('');
  const [hidePassword, setHidePassword]   = useState(true);
  const [loading, setLoading]             = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [callingCode, setCallingCode]     = useState('+91');
  const [countryFlag, setCountryFlag]     = useState('');

  const navigation = useNavigation();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (loginType === 'PASSWORD') {
        (navigation as any).navigate('Drawer');
      } else {
        navigation.navigate('OtpLogin');
      }
    }, 1400);
  };

  return (
    <View style={styles.safe}>

      {/* ── Hero ── */} 
      <View style={styles.hero}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.badge}>
          <Bike size={32} color={colors.secondary} strokeWidth={2} />
        </View>
        <Text style={styles.heroTitle}>Delivery Partner</Text>
        <Text style={styles.heroSub}>Log in to start delivering</Text>
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

            {/* ── Toggle ── */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.toggleBtn, loginType === 'OTP' && styles.toggleActive]}
                onPress={() => setLoginType('OTP')}
              >
                <Smartphone
                  size={16}
                  color={loginType === 'OTP' ? colors.primary : colors.muted}
                  strokeWidth={2}
                />
                <Text style={[styles.toggleText, loginType === 'OTP' && styles.toggleTextActive]}>
                  OTP Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.toggleBtn, loginType === 'PASSWORD' && styles.toggleActive]}
                onPress={() => setLoginType('PASSWORD')}
              >
                <Lock
                  size={16}
                  color={loginType === 'PASSWORD' ? colors.primary : colors.muted}
                  strokeWidth={2}
                />
                <Text style={[styles.toggleText, loginType === 'PASSWORD' && styles.toggleTextActive]}>
                  Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Mobile Number ── */}
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <View style={styles.mobileRow}>

              {/* Country trigger */}
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
                value={mobile}
                onChangeText={(v) => setMobile(v.replace(/[^0-9]/g, '').slice(0, 10))}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType={loginType === 'OTP' ? 'done' : 'next'}
              />
            </View>

            {/* ── Password ── */}
            {loginType === 'PASSWORD' && (
              <>
                <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Password</Text>
                <View style={styles.passwordBox}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
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
                <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── CTA ── */}
            <TouchableOpacity
              style={[styles.ctaBtn, loading && styles.ctaDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loginType === 'OTP'
                ? <Send size={18} color={colors.primary} strokeWidth={2.5} />
                : <LogIn size={18} color={colors.primary} strokeWidth={2.5} />}
              <Text style={styles.ctaText}>
                {loading ? 'Please wait…' : loginType === 'OTP' ? 'Send OTP' : 'Login'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              {loginType === 'OTP'
                ? 'OTP will be sent to your registered mobile number.'
                : 'Use the password set during partner registration.'}
            </Text>

            {/* ── Divider ── */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>New partner?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* ── Register ── */}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.registerBtn} activeOpacity={0.8}>
              <UserPlus size={18} color={colors.secondary} strokeWidth={2.5} style={{ marginRight: 8 }} />
              <Text style={styles.registerBtnText}>Register as Delivery Partner</Text>
            </TouchableOpacity>

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

      {/* ── Country Picker Modal ── */}
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
          backdrop: {
            backgroundColor: 'rgba(0,0,0,0.45)',
          },
          line: {
            backgroundColor: colors.divider,
          },
          itemsList: {
            paddingHorizontal: 4,
          },
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
            borderWidth: 0,
          },
          searchMessageText: {
            color: colors.muted,
            fontSize: 14,
          },
          countryMessageContainer: {
            paddingVertical: 24,
            alignItems: 'center',
          },
          flag: {
            fontSize: 22,
            marginRight: 8,
          },
          dialCode: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.secondary,
          },
          countryName: {
            fontSize: 14,
            color: colors.secondary,
          },
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

  // ── Toggle ────────────────────────────────────────────────────────────────
  toggleRow: {
    flexDirection: 'row', backgroundColor: '#F0F0F0',
    borderRadius: 16, padding: 5, marginBottom: 28,
  },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 6,
  },
  toggleActive: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  toggleText: { fontSize: 14, fontWeight: '700', color: colors.muted },
  toggleTextActive: { color: colors.primary },

  // ── Field ─────────────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 12, fontWeight: '700', color: '#555', letterSpacing: 0.6,
    textTransform: 'uppercase', marginBottom: 8,
  },

  // ── Mobile ────────────────────────────────────────────────────────────────
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

  // ── Password ──────────────────────────────────────────────────────────────
  passwordBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.inputBorder,
  },
  passwordInput: {
    flex: 1, paddingHorizontal: 16, paddingVertical: 15,
    fontSize: 15, color: colors.secondary,
  },
  eyeBtn: { paddingHorizontal: 14, paddingVertical: 14 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 4 },
  forgotText: { fontSize: 13, fontWeight: '700', color: colors.secondary },

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.secondary, borderRadius: 16, paddingVertical: 17, marginTop: 24,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 7,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: colors.primary, fontSize: 16, fontWeight: '900', letterSpacing: 0.4 },
  note: {
    fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 12, lineHeight: 18,
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerLabel: { marginHorizontal: 12, fontSize: 12, fontWeight: '700', color: '#CCCCCC' },

  // ── Register ──────────────────────────────────────────────────────────────
  registerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.secondary, borderRadius: 16, paddingVertical: 15,
  },
  registerBtnText: { fontSize: 15, fontWeight: '800', color: colors.secondary },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerNote: {
    fontSize: 11, color: '#BBBBBB', textAlign: 'center', marginTop: 20, lineHeight: 17,
  },
  footerLink: { color: colors.secondary, fontWeight: '700' },
});

export default LoginScreen;