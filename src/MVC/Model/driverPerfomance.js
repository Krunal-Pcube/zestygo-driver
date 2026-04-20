import ApiHelper from './apiHelper'

export const getDriverPerfomance = (deliveryPartnerID) => {
  return ApiHelper.get(`driver/reviews/performance-stats/${deliveryPartnerID}`);
};
