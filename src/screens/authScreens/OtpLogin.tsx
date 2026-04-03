import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  Bike, ShieldCheck, RotateCcw, ArrowLeft,
} from 'lucide-react-native';
import { colors } from '../../utils/colors'; 

const { width } = Dimensions.get('window');

const OtpLogin = ({ navigation, route }: any) => {
  const type  = route?.params?.type  ?? 'phone';
  const value = route?.params?.value ?? '9876543210';

  const otpLength = 6;
  const [otp, setOtp]                   = useState(new Array(otpLength).fill(''));
  const [loading, setLoading]           = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const inputRefs = useRef([]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const maskPhone = (n) =>
    !n || n.length < 4 ? '******' : `+91 ******${n.slice(-4)}`;

  const maskEmail = (e) => {
    const [n, d] = e?.split('@') || [];
    return d ? `${n.slice(0, 2)}****@${d}` : '';
  };

  const maskedValue =
    type === 'email' ? maskEmail(value) : maskPhone(value);

  // ── auto-focus first box ──────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  // ── OTP input handlers ────────────────────────────────────────────────────
  const handleChange = (text, index) => {
    if (text.length > 1) text = text.slice(-1);
    const next = [...otp];
    next[index] = text;
    setOtp(next);
    if (text !== '' && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (text === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── mock actions ──────────────────────────────────────────────────────────
  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
    navigation.navigate('Drawer');
  }; 

  const handleResend = () => {
    setLoadingResend(true);
    setOtp(new Array(otpLength).fill(''));
    inputRefs.current[0]?.focus();
    setTimeout(() => setLoadingResend(false), 1400);
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <View style={styles.safe}>

      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />

        {/* back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={colors.white} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.badge}>
          <ShieldCheck size={32} color={colors.secondary} strokeWidth={2} />
        </View>
        <Text style={styles.heroTitle}>OTP Verification</Text>
        <Text style={styles.heroSub}>
          Code sent to{' '}
          <Text style={styles.heroHighlight}>{maskedValue}</Text>
        </Text>
      </View>

      {/* ── Body ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.sheet}>

          <Text style={styles.fieldLabel}>Enter 6-digit code</Text>

          {/* ── OTP Boxes ── */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  digit !== '' && styles.otpFilled,
                  index === otp.findLastIndex((d) => d !== '') + 1 && styles.otpActive,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') handleBackspace(digit, index);
                }}
              />
            ))}
          </View>

          {/* ── Verify CTA ── */}
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              (!isComplete || loading) && styles.ctaDisabled,
            ]}
            onPress={handleVerify}
            activeOpacity={0.85}
            disabled={!isComplete || loading}
          >
            <ShieldCheck size={18} color={colors.secondary} strokeWidth={2.5} />
            <Text style={styles.ctaText}>
              {loading ? 'Verifying…' : 'Verify & Proceed'}
            </Text>
          </TouchableOpacity>

          {/* ── Resend ── */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive OTP code? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResend}
              disabled={loadingResend}
            >
              {loadingResend ? (
                <ActivityIndicator size="small" color={colors.secondary} />
              ) : (
                <View style={styles.resendBtn}>
                  <RotateCcw size={13} color={colors.secondary} strokeWidth={2.5} />
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Wrong number ── */}
          <TouchableOpacity
            style={styles.changeBtn}
            activeOpacity={0.7}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.changeBtnText}>
              Change {type === 'email' ? 'email' : 'number'}?
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const BOX_SIZE = (width - 48 - 5 * 10) / 6;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colors.secondary,
    paddingTop: 28, paddingBottom: 36, paddingHorizontal: 24, overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(207,255,4,0.07)', top: -70, right: -60,
  },
  blob2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(207,255,4,0.05)', bottom: 0, left: -40,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  badge: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
  },
  heroTitle: {
    fontSize: 30, fontWeight: '900', color: colors.white, letterSpacing: -0.5, marginBottom: 6,
  },
  heroSub: {
    fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: '500',
  },
  heroHighlight: {
    color: colors.primary, fontWeight: '700',
  },

  // ── Sheet ─────────────────────────────────────────────────────────────────
  sheet: {
    flex: 1, backgroundColor: colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 32,
  },

  // ── Field Label ───────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 12, fontWeight: '700', color: '#555',
    letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 20,
  },

  // ── OTP Boxes ─────────────────────────────────────────────────────────────
  otpRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32,
  },
  otpBox: {
    width: BOX_SIZE, height: BOX_SIZE + 8,
    borderWidth: 1.5, borderRadius: 14,
    borderColor: colors.inputBorder, backgroundColor: colors.inputBg,
    textAlign: 'center', fontSize: 22, fontWeight: '700', color: colors.secondary,
  },
  otpFilled: {
    borderColor: colors.success, backgroundColor: '#F0FFF8',
    shadowColor: colors.success, shadowOpacity: 0.2,
    shadowRadius: 4, elevation: 2,
  },
  otpActive: {
    borderColor: colors.secondary, backgroundColor: colors.white,
  },

  // ── CTA ───────────────────────────────────────────────────────────────────
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 17,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 7,
  },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: colors.secondary, fontSize: 16, fontWeight: '900', letterSpacing: 0.4 },

  // ── Resend ────────────────────────────────────────────────────────────────
  resendRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', marginTop: 24,
  },
  resendText: { fontSize: 13, color: '#666' },
  resendBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resendLink: {
    fontSize: 13, fontWeight: '700',
    color: colors.secondary, textDecorationLine: 'underline',
  },

  // ── Change number ─────────────────────────────────────────────────────────
  changeBtn: { alignItems: 'center', marginTop: 16 },
  changeBtnText: { fontSize: 13, color: colors.muted, textDecorationLine: 'underline' },
});

export default OtpLogin;