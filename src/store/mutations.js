// https://vuex.vuejs.org/en/mutations.html

export default {
  loggedOut(state) {
    state.user = '';
  },
  loggingIn(state, loggingIn) {
    state.loggingIn = loggingIn;
  },
  loggingInSSO(state, loggingInSSO) {
    state.loggingInSSO = loggingInSSO;
  },
  hasError(state, hasError) {
    state.hasError = hasError;
  },
  error(state, error) {
    state.error = error;
  },
  user(state, user) {
    state.user = user;
  },
  users(state, users) {
    state.users = users;
  },
};
