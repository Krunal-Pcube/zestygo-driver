import ApiHelper from './apiHelper'

export const acceptOrder = payload => {
  return ApiHelper.put('driver/assignment/accept-order', payload);
}; 
 

export const rejectOrder = payload => {
  return ApiHelper.put('driver/assignment/reject-order', payload);
}; 


export const updateOrderStatus = (deliveryTripOrderId, payload) => {
  return ApiHelper.put(`driver/assignment/order-status/${deliveryTripOrderId}`, payload);
};



export const getTripDetails = (deliveryTripId) => {
  return ApiHelper.get(`driver/assignment/trip/${deliveryTripId}`);
};



export const uploadOrderProof = (deliveryTripOrderId, payload) => {
  return ApiHelper.put(
    `driver/assignment/order-proof/${deliveryTripOrderId}`,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};