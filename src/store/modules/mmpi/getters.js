// https://vuex.vuejs.org/en/getters.html

export default {
  getError: (state) => state.error,
  getInstances: (state) => state.instances,
  getDeployInstances: (state) => state.deploy_instances,
  // Delivery Chanins for CMS Inventory page
  deliveryChains: (state) => (deliveryChain) => {
    if (deliveryChain) {
      return state.deliveryChains.filter((e) => e.id !== deliveryChain.id);
    }
    return state.deliveryChains;
  },
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
  hashesByType: (state) => (type) => state.hashes.filter((hash) => hash.repo_type.key === type),
};
