import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CommonButton from '../components/CommonBtn';
import { scale } from 'react-native-size-matters';
import fonts from '../utils/fonts/fontsList';

const ResetPasswordSuccess = () => {
  const navigation = useNavigation();

  const handleGoToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Success Image */}
      <Image
        source={require('../assets/icons/check.png')} // replace if needed
        style={styles.image}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Password Reset Successfully</Text>

      {/* Description */}
      <Text style={styles.subtitle}>
        Your password has been updated successfully. You can now log in using
        your new password.
      </Text>

      {/* Button */}
      <View style={styles.buttonWrapper}>
        <CommonButton title="Go to Login" onPress={handleGoToLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(30),
  },
  image: {
    width: scale(180),
    height: scale(180),
    marginBottom: scale(30),
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: scale(22),
    color: '#000',
    textAlign: 'center',
    marginBottom: scale(10),
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: scale(15),
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: scale(40),
  },
  buttonWrapper: {
    width: '100%',
  },
});

export default ResetPasswordSuccess;
