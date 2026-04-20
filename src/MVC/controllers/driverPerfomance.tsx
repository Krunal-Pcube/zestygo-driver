
 import Toast from 'react-native-toast-message';
import { getDriverPerfomance } from '../Model/driverPerfomance';

export const getDriverPerformanceController = async ({
  deliveryPartnerID,
  onSuccess,
}) => { 
  try {
    const res = await getDriverPerfomance(deliveryPartnerID);

    // console.log('Driver Performance Response ::::', res); 

    if (res?.data?.status === 200) {
      const performanceData = res.data.data;

      // Optional callback to update UI/state
      onSuccess?.(performanceData);

      return performanceData; // return data for direct use
    }

    Toast.show({
      type: 'error',
      text1: 'Failed to fetch performance',
      text2: res?.data?.message || 'Something went wrong',
      position: 'top',
      topOffset: 50,
    });

    return null;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.response?.data?.message || 'Something went wrong',
      position: 'top',
      topOffset: 50,
    });

    return null;
  }
};