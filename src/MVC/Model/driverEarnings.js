import ApiHelper from './apiHelper';

export const getDriverEarnings = (params = {}) => {
  return ApiHelper.get('driver/earnings', {
    params,
  });
};


export const driverActiveSessionStats = (deliveryPartnerID) => {
  return ApiHelper.get(`driver/reviews/active-session-stats/${deliveryPartnerID}`);
}; 