import Toast from 'react-native-toast-message';
import { acceptOrder, getTripDetails, rejectOrder, updateOrderStatus, uploadOrderProof } from '../Model/driverAssignment';



// ✅ Accept Order
export const acceptOrderController = async ({ payload, onSuccess }) => {
  try {
    const res = await acceptOrder(payload);
 
    if (res?.data?.status === 200) {
      const data = res.data.data;

      onSuccess?.(data);

      Toast.show({
        type: 'success',
        text1: res.data.message || 'Order accepted successfully',
        position: 'top',
        topOffset: 50,
    
      });

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'Accept Failed',
      text2: res?.data?.message || 'Unable to accept order',
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


// ✅ Reject Order
export const rejectOrderController = async ({ payload, onSuccess }) => {
  try {
    const res = await rejectOrder(payload);

    if (res?.data?.status === 200) {
      const data = res.data.data;

      onSuccess?.(data);

      // Toast.show({
      //   type: 'success',
      //   text1: res.data.message || 'Order rejected',
      //   position: 'top',
      //   topOffset: 50,
      // });

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'Reject Failed',
      text2: res?.data?.message || 'Unable to reject order',
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


// ✅ Update Order Status
export const updateOrderStatusController = async ({
  deliveryTripOrderId,
  payload,
  onStatusUpdate,
}) => {
  try {
    const res = await updateOrderStatus(deliveryTripOrderId, payload); 

    if (res?.data?.status === 200) {
      const data = res.data.data;

      onStatusUpdate?.(data);

      Toast.show({
        type: 'success',
        text1: res.data.message || 'Order status updated',
        position: 'top',
        topOffset: 50,
      });

      return true;
    }

    Toast.show({
      type: 'error',
      text1: 'Update Failed',
      text2: res?.data?.message || 'Unable to update order status',
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




// ✅ Get Trip Details
export const getTripDetailsController = async ({ deliveryTripId, onSuccess }) => {
  try {
    console.log('[getTripDetailsController] Fetching trip ID:', deliveryTripId);

    if (!deliveryTripId) {
      console.error('[getTripDetailsController] No deliveryTripId provided!');
      return null;
    }

    const res = await getTripDetails(deliveryTripId);
 
    if (res?.data?.status === 200) {
      const data = res.data.data;

      onSuccess?.(data);

      return data; // useful if you want to use directly
    }

    Toast.show({
      type: 'error',
      text1: 'Failed',
      text2: res?.data?.message || 'Unable to fetch trip details',
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

    throw error;
  }
};




export const uploadOrderProofController = async ({
  deliveryTripOrderId,
  payload, // FormData
  onSuccess,
}) => {
  try {
    const res = await uploadOrderProof(deliveryTripOrderId, payload);

    // console.log('Upload Proof Response ::::', res); 

    if (res?.data?.status === 200) {
      const proofData = res.data.data;

      // callback with data + full response
      onSuccess?.(proofData, res);

      return proofData;
    }

    Toast.show({
      type: 'error',
      text1: 'Failed to upload proof',
      text2: res?.data?.message || 'Something went wrong',
      position: 'top',
      topOffset: 50,
    });

    return null;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Upload Error',
      text2: error?.response?.data?.message || error?.message || 'Something went wrong',
      position: 'top',
      topOffset: 50,
    });

    return null;
  }
};