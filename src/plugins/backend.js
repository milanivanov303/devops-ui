import ApiSdk from '@enterpriseapps/ea-js-sdk';
import config from '../../config';

// Main api sdk instance. It is used for authentication and requests with logged in user
const apiSdk = new ApiSdk(config);

window.auth = apiSdk.auth;

window.api = name => apiSdk.api(config[name].url, config[name].code);

// Auto api sdk instance. It is used for requests when no user is logged into the system
const apiSdkAuto = () => {
  if (!window.apiSdkAuto) {
    window.apiSdkAuto = new ApiSdk(config);
  }
  return window.apiSdkAuto;
};

// Create api instance on demand
window.apiAuto = name => apiSdkAuto().api(config[name].url, config[name].code);
