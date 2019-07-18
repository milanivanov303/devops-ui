// https://vuex.vuejs.org/en/getters.html

export default {
  isLoggingIn: state => state.loggingIn,
  isLoggingInSSO: state => state.loggingInSSO,
  hasError: state => state.hasError,
  getError: state => state.error,
  user: state => state.user,
};
