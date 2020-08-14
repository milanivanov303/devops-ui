// https://vuex.vuejs.org/en/getters.html

export default {
  deliveryChains: state => (deliveryChain) => {
    if (deliveryChain) {
      return state.deliveryChains.filter(e => e.id !== deliveryChain.id);
    }
    return state.deliveryChains;
  },
  chainDevInstance: () => instances => Object.values(instances).filter((instance) => {
    if (instance.instance_type_id === 'DEV'
        && instance.owner.key === 'codix'
        && instance.status.key === 'active') {
      return instance;
    }
    return null;
  }),
};
