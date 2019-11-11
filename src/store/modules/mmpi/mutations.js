// https://vuex.vuejs.org/en/mutations.html

export default {
  instances(state, instances) {
    state.instances = instances;
  },
  error(state, error) {
    state.error = error;
  },
};
