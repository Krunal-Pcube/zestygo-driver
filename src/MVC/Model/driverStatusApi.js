import ApiHelper from './apiHelper'

export const changeStatus = payload => {
  return ApiHelper.put('driver/status', payload);
}; 



