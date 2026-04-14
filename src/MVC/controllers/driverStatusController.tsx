
import Toast from 'react-native-toast-message';
import { changeLocationEveryMinute, changeStatus } from '../Model/driverStatusApi';

export const changeStatusController = async ({ payload, onStatusChange }) => {
  try {
    const res = await changeStatus(payload);
 
    console.log('Change Status Payload + Response ::::', payload, res);

    if (res.data.status === 200) {
      const updatedStatus = res.data.data;

      // Update context/state (passed from screen)
      onStatusChange?.(updatedStatus);

      // Toast.show({
      //   type: 'success',
      //   text1: res.data.message || 'Status updated successfully',
      //   position: 'top',
      //   topOffset: 50,
      // });

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'Status Update Failed',
      text2: res.data.message || 'Unable to update status',
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



export const changeLocationController = async ({ payload, onLocationUpdate }) => {
  try {
    const res = await changeLocationEveryMinute(payload);

    console.log('Location Update Payload + Response ::::', payload, res);

    if (res?.data?.status === 200) {
      const updatedLocation = res.data.data;

      // Optional callback (if you want to update state/UI)
      onLocationUpdate?.(updatedLocation);

      return true;
    }

    // ❌ Optional: You can skip toast here to avoid spam every minute
    console.log('Location update failed:', res?.data?.message);

    return false;
  } catch (error) {
    // ❌ Avoid toast spam for background calls
    console.log(
      'Location update error:',
      error?.response?.data?.message || error.message
    );

    return false;
  }
};