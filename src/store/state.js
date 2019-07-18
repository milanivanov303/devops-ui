// https://vuex.vuejs.org/en/state.html
let user = null;
if (sessionStorage.getItem('user')) {
  user = JSON.parse(sessionStorage.getItem('user'));
}

export default {
  token: localStorage.getItem('token') || '',
  user,
  loggingIn: false,
  loggingInSSO: false,
  hasError: false,
  error: '',
};
