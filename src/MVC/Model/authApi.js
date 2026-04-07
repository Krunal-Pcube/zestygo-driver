import ApiHelper from './apiHelper'

export const loginUser = payload => {
  return ApiHelper.post('driver/login', payload);
}; 


export const verifyOTP = payload => {
  return ApiHelper.post('driver/verify-otp', payload);
};  


export const sendOTP = payload => {
  return ApiHelper.post('driver/resend-otp', payload);
}; 


export const forgotPassword = payload => { 
  return ApiHelper.post('driver/forgot-password', payload);
};

 
export const verifyForgotPasswordOtp = payload => {
  return ApiHelper.post('driver/forgot-password/verify-otp', payload);
};

export const createNewPassword = payload => {
  return ApiHelper.post('driver/reset-password', payload);
};  


export const logoutAllDevices = () => {
  return ApiHelper.post('driver/logout/all-device');
};
 
export const logoutCurrentDevice = payload => {
  return ApiHelper.post('driver/logout/current-device', payload);
}; 


 
// Simple register function
// export const registerUser = payload => {
//   return ApiHelper.post('customer/registration', payload);
// };
   









 



