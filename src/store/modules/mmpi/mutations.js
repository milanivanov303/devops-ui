// https://vuex.vuejs.org/en/mutations.html

export default {
  instances(state, instances) {
    state.instances = instances;
  },
  projects(state, projects) {
    state.projects = projects;
  },
  deliveryChains(state, deliveryChains) {
    state.delivery_chains = deliveryChains;
  },
  error(state, error) {
    state.error = error;
  },
};
