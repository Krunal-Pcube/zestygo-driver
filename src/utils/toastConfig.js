import React from 'react';
import CustomToast from '../components/CustomToast';

export const toastConfig = {
  success: props => <CustomToast {...props} type="success"  />,
  error: props => <CustomToast {...props} type="error" />,
  info: props => <CustomToast {...props} type="info" />,
};
  