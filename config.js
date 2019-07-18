module.exports = {
  "user-management": {
    url: process.env.VUE_APP_USER_MANAGEMENT_URL
  },
  devops: {
    url: process.env.VUE_APP_DEVOPS_API_URL,
    code: process.env.VUE_APP_DEVOPS_API_CODE
  },
  extranet: {
    docker: {
      image: process.env.VUE_APP_EXTRANET_IMAGE
    }
  }
};
