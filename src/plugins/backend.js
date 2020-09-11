import ApiSdk from './api-sdk';
import config from '../../config';

// Main api sdk instance. It is used for authentication and requests with logged in user
const apiSdk = new ApiSdk(
  config.um.url,
  config.auth.code,
  {
    session_name: config.auth.session_name,
    session_expire: config.auth.session_expire,
  },
);

window.auth = apiSdk.auth;

window.api = name => apiSdk.api(config[name].url, config[name].code);

// Auto api sdk instance. It is used for requests when no user is logged into the system
const apiSdkAuto = () => {
  if (!window.apiSdkAuto) {
    window.apiSdkAuto = new ApiSdk(
      config.um.url,
      config.auth.code,
      {
        session_name: 'ea_auto_session',
        session_expire: config.auth.session_expire,
        username: 'ea_auto',
        password: 'auto_ea',
      },
    );
  }
  return window.apiSdkAuto;
};

// Create api instance on demand
window.apiAuto = name => apiSdkAuto().api(config[name].url, config[name].code);
