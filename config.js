module.exports = {
  'user-management': {
    url: process.env.VUE_APP_USER_MANAGEMENT_URL,
  },
  devops: {
    url: process.env.VUE_APP_DEVOPS_API_URL,
    code: 'JQq5BzW7a7d',
  },
  extranet: {
    docker: {
      image: 'avitohol.codixfr.private:5000/extranet-base:1.6.4',
    },
  },
};
