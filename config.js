module.exports = {
  auth: {
    code: process.env.VUE_APP_DEVOPS_API_CODE,
    applications: process.env.VUE_APP_AUTH_APPS,
    session_expire: process.env.VUE_APP_AUTH_SESSION_EXPIRE,
    session_name: process.env.VUE_APP_AUTH_SESSION_NAME,
  },
  auth_auto: {
    username: process.env.VUE_APP_AUTH_AUTO_USERNAME,
    password: process.env.VUE_APP_AUTH_AUTO_PASSWORD,
    session_name: process.env.VUE_APP_AUTH_AUTO_SESSION_NAME,
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
    web: process.env.VUE_APP_MMPI_URL,
    modif_cmd: process.env.VUE_APP_MODIF_CMD,
    modif_module_home: process.env.VUE_APP_MODIF_MODULE_HOME,
    modif_scripts_destination: process.env.VUE_APP_MODIF_SCRIPTS_DESTINATION,
    modif_tmp_destination: process.env.VUE_APP_MODIF_TMP_DESTINATION,
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
