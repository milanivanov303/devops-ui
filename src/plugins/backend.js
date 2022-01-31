import ApiSdk from '@enterpriseapps/ea-js-sdk';
import config from '../../config';

// Main api sdk instance. It is used for authentication and requests with logged in user
const apiSdk = new ApiSdk({
  url: config.um.api_url,
  code: config.auth.code,
  applications: config.auth.applications,
  session_name: config.auth.session_name,
  session_expire: config.auth.session_expire,
});

window.auth = apiSdk.auth;

window.api = (name) => apiSdk.api(
  config[name].api_url || config[name].url,
  config[name].code,
);

// Auto api sdk instance. It is used for requests when no user is logged into the system
const apiSdkAuto = () => {
  if (!window.apiSdkAuto) {
    window.apiSdkAuto = new ApiSdk({
      url: config.um.api_url,
      code: config.auth.code,
      applications: config.auth.applications,
      session_name: config.auth.session_name.concat('_auto'),
      session_expire: config.auth.session_expire,
      username: config.auth_auto.username,
      password: config.auth_auto.password,
    });
  }
  return window.apiSdkAuto;
};

// Create api instance on demand
window.apiAuto = (name) => apiSdkAuto().api(
  config[name].api_url || config[name].url,
  config[name].code,
);
