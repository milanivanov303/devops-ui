// https://vuex.vuejs.org/en/mutations.html

export default {
  error(state, error) {
    state.error = error;
  },
  fillDemos(state, demos) {
    state.demos = demos;
  },
};
