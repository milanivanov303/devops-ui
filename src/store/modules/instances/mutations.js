// https://vuex.vuejs.org/en/mutations.html

export default {
  error(state, error) {
    state.error = error;
  },
  instances(state, instances) {
    state.instances = instances;
  },
  devInstances(state, devInstances) {
    state.devInstances = devInstances;
  },
};
