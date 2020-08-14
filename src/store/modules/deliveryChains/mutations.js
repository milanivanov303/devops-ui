// https://vuex.vuejs.org/en/mutations.html

export default {
  error(state, error) {
    state.error = error;
  },
  deliveryChains(state, deliveryChains) {
    state.deliveryChains = deliveryChains;
  },
};
