import Toast from 'react-native-toast-message';
import { addReview } from '../Model/driverReviews';

export const addReviewController = async ({ payload, onReviewAdded }) => {
  try {
    const res = await addReview(payload);
 
    // console.log('Add Review Payload + Response ::::', payload, res);

    if (res?.data?.status === 200) {
      const reviewData = res.data.data;

      // Optional callback to update UI/state
      onReviewAdded?.(reviewData);

      Toast.show({
        type: 'success',
        text1: res.data.message || 'Review added successfully',
        position: 'top',
        topOffset: 50,
      });

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'Review Failed',
      text2: res?.data?.message || 'Unable to add review',
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