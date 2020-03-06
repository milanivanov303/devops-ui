// https://vuex.vuejs.org/en/mutations.html

export default {
  promise(state, { name, promise }) {
    state.promises[name] = promise;
  },
  error(state, error) {
    state.error = error;
  },
};
