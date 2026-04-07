let _logoutHandler = null;

export const registerLogoutHandler = (fn) => {
  _logoutHandler = fn;
}; 

export const triggerLogout = () => {
  if (_logoutHandler) _logoutHandler();
}; 