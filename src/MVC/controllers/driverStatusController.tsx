
import Toast from 'react-native-toast-message';
import { changeStatus } from '../Model/driverStatusApi';

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