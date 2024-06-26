// https://vuex.vuejs.org/en/getters.html

export default {
  getError: (state) => state.error,
  // Delivery Chanins for CMS Inventory page
  // deliveryChains: (state) => (deliveryChain) => {
  //   if (deliveryChain) {
  //     return state.deliveryChains.filter((e) => e.id !== deliveryChain.id);
  //   }
  //   return state.deliveryChains;
  // },
  deliveryChainsByProject: (state) => (project) => {
    if (project) {
      return state.deliveryChains
        .filter((dc) => dc.projects.find((p) => project.id === p.id));
    }
    return state.deliveryChains;
  },
  deliveryChainTypes: (state) => state.deliveryChains
    .reduce((acc, dc) => {
      const { type } = dc;
      acc[type.id] = type;
      return acc;
    }, []),
  instancesByTypeAndProject: (state) => (type, project) => {
    if (type && project) {
      return state.deliveryChains
        .filter((dc) => dc.projects.find((p) => project.id === p.id))
        .filter((dc) => dc.instances.find((i) => type.id === i.environment_type_id))
        .reduce((acc, dc) => {
          const { instances } = dc;
          instances.map((i) => {
            acc[i.id] = i;
            return acc;
          });
          return acc;
        }, []);
    }
    return [];
  },
  chainDevInstance: () => (instances) => Object.values(instances).filter((instance) => {
    if (instance.instance_type_id === 'DEV'
      && instance.owner.key === 'codix'
      && instance.status.key === 'active') {
      return instance;
    }
    return null;
  }),
  getSeOperations: (state) => state.operationType.filter((type) => type.subtype === 'SE'),
};
