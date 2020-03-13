// https://vuex.vuejs.org/en/mutations.html

export default {
  promise(state, { name, promise }) {
    state.promises[name] = {
      time: new Date().getTime(),
      promise,
    };
  },
  error(state, error) {
    state.error = error;
  },
};
