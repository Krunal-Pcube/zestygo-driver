import Toast from 'react-native-toast-message';
import { driverActiveSessionStats, getDriverEarnings } from '../Model/driverEarnings';

export const getDriverEarningsController = async ({
  params = {},
  onSuccess,
}) => { 
  try {
    const res = await getDriverEarnings(params);

    // console.log('Driver Earnings Response ::::', res);

    if (res?.data?.status === 200) {
      const earningsData = res.data.data;

      // update UI/state if needed
     onSuccess?.(earningsData, res);   // <-- add second arg

      return earningsData;
    }

    Toast.show({
      type: 'error',
      text1: 'Failed to fetch earnings',
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


export const driverActiveSessionStatsController = async ({
  deliveryPartnerID,
  onSuccess,
}) => {
  try {
    const res = await driverActiveSessionStats(deliveryPartnerID);

    // console.log('Active Session Stats Response ::::', res);

    if (res?.data?.status === 200) {
      const statsData = res.data.data;

      // pass both data + full response (same as earnings)
      onSuccess?.(statsData, res);

      return statsData;
    }

    Toast.show({
      type: 'error',
      text1: 'Failed to fetch session stats',
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