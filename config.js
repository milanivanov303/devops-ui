module.exports = {
  auth: {
    code: process.env.VUE_APP_DEVOPS_API_CODE,
    session_expire: process.env.VUE_APP_AUTH_SESSION_EXPIRE,
    session_name: process.env.VUE_APP_AUTH_SESSION_NAME,
  },
  um: {
    url: process.env.VUE_APP_USER_MANAGEMENT_API_URL,
    code: process.env.VUE_APP_USER_MANAGEMENT_API_CODE,
  },
  cms: {
    url: process.env.VUE_APP_CMS_API_URL,
    code: process.env.VUE_APP_CMS_API_CODE,
  },
  devops: {
    url: process.env.VUE_APP_DEVOPS_API_URL,
    code: process.env.VUE_APP_DEVOPS_API_CODE,
  },
  mmpi: {
    url: process.env.VUE_APP_MMPI_API_URL,
    code: process.env.VUE_APP_MMPI_API_CODE,
  },
  ws: {
    url: process.env.VUE_APP_WS_URL,
    username: process.env.VUE_APP_WS_USERNAME,
    password: process.env.VUE_APP_WS_PASSWORD,
    vhost: process.env.VUE_APP_WS_VHOST,
  },
  instance: process.env.VUE_APP_ENV,
  webssh2_port: process.env.VUE_APP_WEBSSH2_PORT,
};
