import React, {  useEffect, useState , useCallback, createContext } from 'react';
import { getAuthData, clearAuthData } from '../../utils/authStorage';
import ApiHelper from '../Model/apiHelper'; // 🔹 make sure this is imported
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerLogoutHandler } from '../../utils/authEvents'; // ✅ add this
import { STORAGE_KEYS } from '../../utils/storage/asyncStorageKeys';
import { connectSocket, disconnectSocket } from '../../services/socketIndex'; // ← add this
import { changeStatusController } from '../controllers/driverStatusController'; // ← add this
 

export const AuthContext = createContext(null); 

export const AuthProvider = ({ children }) => {  
  const [auth, setAuth] = useState(null); 
  const [loading, setLoading] = useState(true);
 
  // 🔹 load auth from AsyncStorage on app start
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const data = await getAuthData(); 
        console.log('Loaded auth from storage::', data); // <— check shape
        console.log('AUTH TOKEN FROM STORAGE ::', data?.token); // <— check shape
 
       if(data?.token) {
          connectSocket(data?.token); 
          }

        setAuth(data);
      } catch (err) {
        console.log('Error loading auth:', err);
      } finally {
        setLoading(false);
      } 
    };
    bootstrapAuth();
  }, []);


  // 🔹 login function
  const login = authData => {
    // ✅ create a new object reference to force state update
    setAuth({ ...authData });

    // ✅ set axios default token immediately
    if (authData?.token) {
      ApiHelper.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
      connectSocket(authData.token); // ← token is right here
    }

    console.log('AuthContext updated with token:', authData.token);
  };
 

  const logout = useCallback(async () => {
  try {
    // Set user to offline before logout (best effort - don't block logout on failure)
    try {
      await changeStatusController({
        payload: {
          current_status: 'offline',
          accepting_new_orders: '0',
        },
        onStatusChange: (updatedStatus) => {
          console.log('[Logout] Set to offline:', updatedStatus);
        },
      });
    } catch (statusError) {
      console.log('[Logout] Failed to set offline status:', statusError);
      // Continue with logout even if status update fails
    }

    // Clear online status from AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEYS.DRIVER_ONLINE_STATUS);
    console.log('[Logout] Cleared online status from AsyncStorage');

    await clearAuthData();
    delete ApiHelper.defaults.headers.common.Authorization; 
    disconnectSocket(); // ← clean up socket
    setAuth(null); 
  } catch (err) {
    console.log('Error during logout:', err);
  }
}, []); // ✅ empty deps — setAuth/setProfile are stable React setters

  
   useEffect(() => {
    registerLogoutHandler(logout);
  }, [logout]);
 
  return (
    <AuthContext.Provider
      value={{
        auth,
        isLoggedIn: !!auth?.token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
