import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import { colors } from '../../utils/colors';
import fonts from '../../utils/fonts/fontsList'; 
import { AuthContext } from '../../MVC/context/AuthContext';
import { getDeviceInfo } from '../../utils/deviceInfo';
import { LoginSendOTPController, passwordLoginController } from '../../MVC/controllers/authController';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const [loginType, setLoginType] = useState('OTP'); // OTP | PASSWORD
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    const value = email.trim();

    // ================= VALIDATE EMAIL =================
    if (!emailRegex.test(value)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 50,
      });
      return;
    }

    // ================= OTP LOGIN =================
    if (loginType === 'OTP') {
      setLoading(true);
      const payload = { email: value };

      try {
        await LoginSendOTPController({ payload, navigation });
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err.message || 'Something went wrong',
          position: 'top',
          topOffset: 50,
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // ================= PASSWORD LOGIN =================
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Password',
        text2: 'Please enter your password',
        position: 'top',
        topOffset: 50,
      });
      return; 
    }

    setLoading(true);
    const deviceInfo = await getDeviceInfo();

    const payload = {
      email: value,
      password,
      device_type: deviceInfo?.device_type,
      os_type: deviceInfo?.os_type,
      device_name: deviceInfo?.device_name,
      fcm_token: deviceInfo?.fcm_token
    };

    try {
      await passwordLoginController({
        payload,
        navigation,
        onLoginSuccess: login,
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'Something went wrong',
        position: 'top',
        topOffset: 50,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Login"
        subtitle={
          loginType === 'OTP'
            ? 'Login using OTP verification'
            : 'Login using Email & Password'
        }
        image={require('../../assets/food.png')}

      />

      <View style={styles.formContainer}>

        {/* LOGIN TYPE SWITCH */}
        <View style={styles.switchContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.switchButton, loginType === 'OTP' && styles.activeSwitch]}
            onPress={() => setLoginType('OTP')}
          >
            <Text style={[styles.switchText, loginType === 'OTP' && styles.activeSwitchText]}>
              OTP Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.switchButton, loginType === 'PASSWORD' && styles.activeSwitch]}
            onPress={() => setLoginType('PASSWORD')}
          >
            <Text style={[styles.switchText, loginType === 'PASSWORD' && styles.activeSwitchText]}>
              Password Login
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* EMAIL INPUT */}
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* PASSWORD FIELD — only for PASSWORD login */}
          {loginType === 'PASSWORD' && (
            <View style={{ marginBottom: scale(12) }}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry={hidePassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                activeOpacity={0.7}
                onPress={() => setHidePassword(!hidePassword)}
              >
                <Ionicons
                  name={hidePassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* FORGOT PASSWORD — only for PASSWORD login */}
          {loginType === 'PASSWORD' && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <View style={{ marginTop: scale(10) }}>
            <CommonButton
              title={loginType === 'OTP' ? 'Send OTP' : 'Login'}
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
            />
          </View>

          {/* SIGNUP LINK */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity 
            // onPress={() => navigation.navigate('SignUp')}
            >
            
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: scale(30),
    paddingTop: scale(20),
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: scale(0),
    marginBottom: scale(24),
  },
  switchButton: {
    flex: 1,
    paddingVertical: scale(12),
    alignItems: 'center',
  },
  activeSwitch: {
    backgroundColor: colors.white,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.black,
    borderRadius: 12,
  },
  switchText: {
    fontSize: scale(14),
    fontFamily: fonts.semiBold,
    color: '#666',
    fontWeight: '500',
  },
  activeSwitchText: {
    color: colors.black,
    fontWeight: '600',
  },
  input: {
    fontFamily: fonts.regular,
    backgroundColor: colors.background2,
    borderRadius: 12,
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: 16,
    marginBottom: scale(12),
  },
  passwordInput: {
    fontFamily: fonts.regular,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: scale(18),
    paddingVertical: scale(16),
    fontSize: 16,
    marginBottom: scale(2),
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  forgotPasswordButton: {
    marginTop: scale(10),
    alignSelf: 'center',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: scale(14),
    fontFamily: fonts.semiBold,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  signupText: {
    fontSize: scale(13),
    fontFamily: fonts.regular,
    color: '#666',
  },
  signupLink: {
    fontSize: scale(13),
    fontFamily: fonts.semiBold,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;