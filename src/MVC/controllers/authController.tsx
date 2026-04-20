import {
  loginUser,
  sendOTP,
  verifyOTP,
  forgotPassword,
  verifyForgotPasswordOtp,
  createNewPassword,
} from '../Model/authApi';
import { saveAuthData } from '../../utils/authStorage';
import Toast from 'react-native-toast-message';

export const passwordLoginController = async ({
  payload,
  onLoginSuccess,
  navigation,
}) => {
  try {
    const res = await loginUser(payload);

    console.log('Login Payload + Response ::::', payload, res);

    if (res.data.status === 200) {
      const { token, user_id,  delivery_partner_id } = res.data.data;

      // Save to storage
      await saveAuthData({ token, user_id, delivery_partner_id });

      // Update context (passed from screen) 
      onLoginSuccess({ token, user_id, delivery_partner_id });

      Toast.show({
        type: 'success',
        text1: res.data.message,
        position: 'top',
        topOffset: 50,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Drawer' }],
      });

      return true;
    } 

    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: res.data.message || 'Unable to login',
      position: 'top',
      topOffset: 50,
    });

    return false;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.response?.data?.message || 'Something went wrong',
      position: 'top',
      topOffset: 50,
    });

    throw error;
  }
};

export const LoginSendOTPController = async ({ payload, navigation }) => {
  try {
    const res = await sendOTP(payload);
    console.log('Send OTP Response :::', res);

    if (res.data.status === 200) {
      Toast.show({
        type: 'success',
        text1: res.data.message || 'OTP sent successfully',
        position: 'top',
        topOffset: 50,
      });

      // Navigate to OTP screen with type & value
      const isPhone = !!payload.contact_number;
      const value = isPhone ? payload.contact_number : payload.email;

      if (navigation) {
        navigation.navigate('OtpLogin', {
          value,
        }); 
      }

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'OTP Failed',
      text2: res.data.message || 'Unable to send OTP',
      position: 'top',
      topOffset: 50,
    });

    return false;
  } catch (error) {
    console.log('Send OTP Error :::', error?.response?.data || error.message);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        error?.response?.data?.message ||
        'Something went wrong while sending OTP',
      position: 'top',
      topOffset: 50,
    });

    throw error;
  }
};

export const LoginverifyOTPController = async ({
  payload,
  onLoginSuccess,
  navigation,
}) => {
  try {
    const res = await verifyOTP(payload);
    console.log('Verify OTP Response :::', res);

    if (res.data.status === 200) {
      const { token, user_id, delivery_partner_id } = res.data.data;

      // Save to AsyncStorage
      await saveAuthData({ token, user_id, delivery_partner_id });

      // Update AuthContext
      if (onLoginSuccess) {
        onLoginSuccess({ token, user_id, delivery_partner_id });
      }

      Toast.show({
        type: 'success',
        text1: res.data.message || 'Login Successful',
        position: 'top',
        topOffset: 50,
      });

      // Navigate to main app
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Drawer' }],
        });
      }

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'OTP Verification Failed',
      text2: res.data.message || 'Invalid OTP',
      position: 'top',
      topOffset: 50,
    });

    return false;
  } catch (error) {
    console.log('Verify OTP Error :::', error?.response?.data || error.message);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        error?.response?.data?.message || 'Unable to verify OTP. Try again.',
      position: 'top',
      topOffset: 50,
    });

    throw error;
  }
};

// reset password
export const ResetPasswordSendOTPController = async ({
  payload,
  navigation,
}) => {
  try {
    const res = await forgotPassword(payload);
    console.log('Send OTP Response :::', res);

    if (res.data.status === 200) {
      Toast.show({
        type: 'success',
        text1: res.data.message || 'OTP sent successfully',
        position: 'top',
        topOffset: 50,
      });

      // Navigate to OTP screen with type & value
      const isPhone = !!payload.contact_number;
      const value = isPhone ? payload.contact_number : payload.email;

      if (navigation) {
        navigation.navigate('OtpForgotPassword', {
          value,
        });
      }

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'OTP Failed',
      text2: res.data.message || 'Unable to send OTP',
      position: 'top',
      topOffset: 50,
    });

    return false;
  } catch (error) {
    console.log('Send OTP Error :::', error?.response?.data || error.message);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        error?.response?.data?.message ||
        'Something went wrong while sending OTP',
      position: 'top',
      topOffset: 50,
    });

    throw error;
  }
};

export const ForgotPasswordVerifyOTPController = async ({
  payload,
  navigation,
}) => {
  try {
    const res = await verifyForgotPasswordOtp(payload);
    console.log('Forgot Password Verify OTP Response :::', res);

    if (res.data.status === 200) {
      const { reset_token } = res.data.data;

      Toast.show({
        type: 'success',
        text1: res.data.message || 'OTP verified successfully',
        position: 'top',
        topOffset: 50,
      });

      // Navigate to Reset Password screen with token
      if (navigation) {
        navigation.navigate('ResetPassword', {
          token: reset_token,
        });
      }

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'OTP Verification Failed',
      text2: res.data.message || 'Invalid OTP',
      position: 'top',
      topOffset: 50,
    });

    return false;
  } catch (error) {
    console.log(
      'Forgot Password Verify OTP Error :::',
      error?.response?.data || error.message,
    );

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        error?.response?.data?.message || 'Unable to verify OTP. Try again.',
      position: 'top',
      topOffset: 50,
    });

    throw error;
  }
};

export const ResetPasswordController = async ({ payload, navigation }) => {
  try {
    const res = await createNewPassword(payload);
    console.log('Reset Password Response :::', res);

    if (res.data.status === 200) {
      Toast.show({
        type: 'success',
        text1: res.data.message || 'Password reset successfully',
        position: 'top',
        topOffset: 50,
      });

      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'ResetPasswordSuccess' }],
        });
      }

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'Reset Failed',
      text2: res.data.message || 'Invalid or expired token',
      position: 'top',
      topOffset: 50,
    });

    return false;
  } catch (error) {
    console.log(
      'Reset Password Error :::',
      error?.response?.data || error.message,
    );

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        error?.response?.data?.message ||
        'Unable to reset password. Try again.',
      position: 'top',
      topOffset: 50,
    });

    throw error;
  }
};

// export const signupController = async ({ payload, login, navigation }) => {
//   try {
//     const res = await registerUser(payload);
//     console.log('Signup Response :::', res);

//     if (res.data.status === 200) {
//       const { token, user_id, customer_id } = res.data.data;

//       // Save to AsyncStorage
//       await saveAuthData({ token, user_id, customer_id });

//       // Update AuthContext directly
//       if (login) {
//         login({ token, user_id, customer_id });
//       }

//       Toast.show({
//         type: 'success',
//         text1: res.data.message || 'Registration Successful',
//         position: 'top',
//         topOffset: 50,
//       });

//       // Navigate to main app
//       if (navigation) {
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'MyTabs' }],
//         });
//       }

//       return true;
//     }

//     Toast.show({
//       type: 'error',
//       text1: 'Registration Failed',
//       text2: res.data.message || 'Unable to register',
//       position: 'top',
//       topOffset: 50,
//     });

//     return false;
//   } catch (error) {
//     console.log('Signup Error :::', error?.response?.data || error.message);

//     Toast.show({
//       type: 'error',
//       text1: 'Error',
//       text2: error?.response?.data?.message || 'Something went wrong',
//       position: 'top',
//       topOffset: 50,
//     });

//     throw error;
//   }
// };

// google login


// export const googleLoginController = async ({
//   payload,
//   onLoginSuccess,
//   navigation,
// }) => {
//   try {
//     const res = await googleLogin(payload);

//     console.log('Google Login Payload + Response ::::', res);

//     if (res.data.status === 200) {
//       const { token, user_id, customer_id } = res.data.data;

//       // Save to AsyncStorage
//       await saveAuthData({ token, user_id, customer_id });

//       // Update AuthContext
//       if (onLoginSuccess) {
//         onLoginSuccess({ token, user_id, customer_id });
//       }

//       Toast.show({
//         type: 'success',
//         text1: res.data.message || 'Login successful',
//         position: 'top',
//         topOffset: 50,
//       });

//       // Navigate to main app
//       if (navigation) {
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'MyTabs' }],
//         });
//       }

//       return true;
//     }

//     Toast.show({
//       type: 'error',
//       text1: 'Login Failed',
//       text2: res.data.message || 'Unable to login with Google',
//       position: 'top',
//       topOffset: 50,
//     });

//     return false;
//   } catch (error) {
//     console.log(
//       'Google Login Error :::',
//       error?.response?.data || error.message,
//     );

//     Toast.show({
//       type: 'error',
//       text1: 'Error',
//       text2:
//         error?.response?.data?.message ||
//         'Something went wrong during Google login',
//       position: 'top',
//       topOffset: 50,
//     });

//     throw error;
//   }
// };
