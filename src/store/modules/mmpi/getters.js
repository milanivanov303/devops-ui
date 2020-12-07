// https://vuex.vuejs.org/en/getters.html

export default {
  getError: state => state.error,
  getInstances: state => state.instances,
  getDeployInstances: state => state.deploy_instances,
  // Delivery Chanins for CMS Inventory page
  deliveryChains: state => (deliveryChain) => {
    if (deliveryChain) {
      return state.deliveryChains.filter(e => e.id !== deliveryChain.id);
    }
    return state.deliveryChains;
  },
};
