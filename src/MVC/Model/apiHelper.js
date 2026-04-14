 
import axios from 'axios';
import { Platform } from 'react-native';
import { getAuthData, clearAuthData } from '../../utils/authStorage';
import { triggerLogout } from '../../utils/authEvents'; // ✅ add this
import { resetToLogin } from '../../utils/navigationRef';
import Toast from 'react-native-toast-message';

export const BASE_URL = 'http://192.168.29.164:3000/';  

// export const BASE_URL = 'https://api.zesty-go.com';    
// export const BASE_URL = 'https://apideveloper.zesty-go.com';
 
const ApiHelper = axios.create({   
  baseURL: BASE_URL,   
  timeout: 20000,  
  headers: {  
    Accept: 'application/json',
  }, 
});   
  
/* =========================
   REQUEST INTERCEPTOR 
========================= */ 
ApiHelper.interceptors.request.use(  
  async config => {
    const auth = await getAuthData();

    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
 
    // Optional but good practice 
    config.headers['x-platform'] = Platform.OS;
    config.headers['x-app-type'] = 'customer';

    return config;
  }, 
  error => Promise.reject(error),
);

/* =========================
   RESPONSE INTERCEPTOR 
========================= */
ApiHelper.interceptors.response.use(
  response => {
    // console.log('✅ API SUCCESS RESPONSE:');
    // console.log('URL:', response.config?.url);
    // console.log('Status:', response.status);
    // console.log('Data:', response.data);
    return response;
  },
  
  async error => {
    console.log('❌ API ERROR RESPONSE:');
    console.log('URL:', error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Error Data:', error.response?.data);
    console.log('Full Error:', error);

    
    const status = error.response?.status || error.response?.data?.status;

    if (status === 401 || status === 403) {
      await clearAuthData();
      delete ApiHelper.defaults.headers.common.Authorization;
      console.log(`⚠️ ${status} Unauthorized - Auth Cleared`);
      triggerLogout(); // ✅ 1. clear context

     Toast.show({
      type: 'error',
      text1: error.response?.data?.message,
      position: 'top',
      topOffset: 50,
      });
  
     resetToLogin(); // ✅ 2. navigate after small delay so toast is visible
 
    }

    return Promise.reject({
      message:
        error.response?.data?.message ||
        'Network error, please try again',
      status: error.response?.status,
    });
  }
);


export default ApiHelper;
  