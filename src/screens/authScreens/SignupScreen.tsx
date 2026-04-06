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
import AuthHeader from '../../components/AuthHeader';
import CommonButton from '../../components/CommonBtn';
import fonts from '../../utils/fonts/fontsList';
import { colors } from '../../utils/colors';



const SignupScreen = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Sign Up"
        subtitle="Join us and start ordering delicious food"
        image={require('../../assets/food.png')}

      />

      <View style={styles.formContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* FULL NAME */}
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* PHONE */}
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
          />

          {/* PASSWORD */}
          <View style={{ marginBottom: scale(4) }}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create a strong password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              autoCapitalize="none"
            />

            {/* Eye Icon */}
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

          {/* PASSWORD HINT */}
          <Text style={styles.passwordHint}>
            Must be at least 8 characters with a mix of letters and numbers
          </Text>

          {/* SIGN UP BUTTON */}
          <View style={{ marginTop: scale(20) }}>
            <CommonButton
              title="Sign Up"
              onPress={() => {}}
            />
          </View>

          {/* LOGIN LINK */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLink}>Login</Text>
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

  // ── INPUTS ──────────────────────────────────────────
  input: {
    fontFamily: fonts.regular,
    backgroundColor: colors.background2,
    borderRadius: 12, 
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: scale(15),
    color: '#333',
    marginBottom: scale(12),
  },
  passwordInput: {
    fontFamily: fonts.regular,
    backgroundColor: colors.background2,
    borderRadius: 12,
    paddingHorizontal: scale(18),
    paddingVertical: scale(14),
    fontSize: scale(15),
    color: '#333',
    marginBottom: scale(2),
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 16,
  },
  passwordHint: {
    fontFamily: fonts.regular,
    fontSize: scale(9),
    color: '#999',
    textAlign: 'center',
    marginBottom: scale(4),
  },

  // ── LOGIN LINK ───────────────────────────────────────
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: scale(20),
  },
  loginText: {
    fontFamily: fonts.regular,
    fontSize: scale(13),
    color: '#666',
  },
  loginLink: {
    fontFamily: fonts.semiBold,
    fontSize: scale(13),
    color: '#333',
    textDecorationLine: 'underline',
  },

  // ── DIVIDER ──────────────────────────────────────────
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: scale(12),
    fontSize: scale(13),
    fontFamily: fonts.medium,
    color: '#999',
  },

  // ── SOCIAL BUTTONS ───────────────────────────────────
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background2,
    borderRadius: 12,
    paddingVertical: scale(14),
    marginBottom: scale(12),
  },
  socialIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(10),
  },
  socialButtonText: {
    fontFamily: fonts.medium,
    fontSize: scale(15),
    color: '#333',
  },
});

export default SignupScreen;