import ApiHelper from './apiHelper'

export const acceptOrder = payload => {
  return ApiHelper.put('driver/assignment/accept-order', payload);
}; 
 

export const rejectOrder = payload => {
  return ApiHelper.put('driver/assignment/reject-order', payload);
}; 


export const updateOrderStatus = (orderId, payload) => {
  return ApiHelper.put(`driver/assignment/order-status/${orderId}`, payload);
};



export const getTripDetails = (deliveryTripId) => {
  return ApiHelper.get(`driver/assignment/trip/${deliveryTripId}`);
};



