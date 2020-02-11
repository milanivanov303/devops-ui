// https://vuex.vuejs.org/en/state.html
let user = null;
if (localStorage.getItem('user')) {
  user = JSON.parse(localStorage.getItem('user'));
}

export default {
  error: '',
  promises: {},
};
