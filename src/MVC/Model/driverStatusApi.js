import ApiHelper from './apiHelper'

export const changeStatus = payload => {
  return ApiHelper.put('driver/status', payload);
}; 


export const changeLocationEveryMinute = payload => {
  return ApiHelper.put('driver/status/location', payload);
}; 

