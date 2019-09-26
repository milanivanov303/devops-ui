// https://vuex.vuejs.org/en/state.html
let user = null;
if (localStorage.getItem('user')) {
  user = JSON.parse(localStorage.getItem('user'));
}

export default {
  token: localStorage.getItem('token') || '',
  user,
  loggingIn: false,
  loggingInSSO: false,
  hasError: false,
  error: '',
};
