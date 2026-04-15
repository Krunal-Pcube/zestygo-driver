import Toast from 'react-native-toast-message';
import { acceptOrder, rejectOrder, updateOrderStatus } from '../Model/driverAssignment';



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

      Toast.show({
        type: 'success',
        text1: res.data.message || 'Order rejected',
        position: 'top',
        topOffset: 50,
      });

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
  orderId,
  payload,
  onStatusUpdate,
}) => {
  try {
    const res = await updateOrderStatus(orderId, payload); 

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