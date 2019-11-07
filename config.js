module.exports = {
  'user-management': {
    url: process.env.VUE_APP_USER_MANAGEMENT_URL,
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
};
