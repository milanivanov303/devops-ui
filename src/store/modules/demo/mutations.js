// https://vuex.vuejs.org/en/mutations.html

export default {
  error(state, error) {
    state.error = error;
  },
  fillDemos(state, demos) {
    state.demos = demos;
  },
  updateDemos(state, demo) {
    state.demos.map((d) => {
      if (d.id === demo.id) {
        Object.assign(d, demo);
      }
      return state.demos;
    });
  },
};
