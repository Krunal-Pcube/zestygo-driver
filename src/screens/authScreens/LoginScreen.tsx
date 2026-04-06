import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { scale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';
import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import fonts from '../../utils/fonts/fontsList';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [loginType, setLoginType] = useState('OTP');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

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
            style={[
              styles.switchButton,
              loginType === 'OTP' && styles.activeSwitch,
            ]}
            onPress={() => setLoginType('OTP')}
          >
            <Text
              style={[
                styles.switchText,
                loginType === 'OTP' && styles.activeSwitchText,
              ]}
            >
              OTP Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchButton,
              loginType === 'PASSWORD' && styles.activeSwitch,
            ]}
            activeOpacity={0.7}
            onPress={() => setLoginType('PASSWORD')}
          >
            <Text
              style={[
                styles.switchText,
                loginType === 'PASSWORD' && styles.activeSwitchText,
              ]}
            >
              Password Login
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* EMAIL / PHONE */}
          <TextInput
            style={styles.input}
            placeholder="Email or Phone"
            placeholderTextColor="#999"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* PASSWORD FIELD */}
          {loginType === 'PASSWORD' && (
            <View style={{ marginBottom: scale(12) }}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
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

          {/* FORGOT PASSWORD */}
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
              onPress={() => navigation.navigate('OtpLogin')}
            />
          </View> 

          {/* SIGNUP */} 
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
    fontFamily: fonts.medium,       // medium weight for inactive tab
    color: '#666',
  },
  activeSwitchText: {
    fontFamily: fonts.semiBold,     // semiBold for active tab
    color: colors.black,
  },

  input: {
    fontFamily: fonts.regular,      // regular for input text
    backgroundColor: colors.background2,
    borderRadius: 12,
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: 16,
    marginBottom: scale(12),
  },

  passwordInput: {
    fontFamily: fonts.regular,      // regular for input text
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
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
    fontFamily: fonts.semiBold,     // semiBold for "Forgot password?"
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  signupText: {
    fontSize: scale(13),
    fontFamily: fonts.regular,      // regular for plain label
    color: '#666',
  },
  signupLink: {
    fontSize: scale(13),
    fontFamily: fonts.semiBold,     // semiBold for the actionable link
    textDecorationLine: 'underline',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: scale(12),
    fontSize: scale(13),
    fontFamily: fonts.medium,       // medium for divider "OR" label
    color: '#999',
  },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background2,
    borderRadius: 12,
    paddingVertical: scale(14),
    marginBottom: 12,
  },
  socialIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: scale(15),
    fontFamily: fonts.medium,       // medium for social button labels
  },
});

export default LoginScreen;