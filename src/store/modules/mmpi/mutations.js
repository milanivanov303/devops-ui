// https://vuex.vuejs.org/en/mutations.html

export default {
  error(state, error) {
    state.error = error;
  },

  projects(state, projects) {
    state.projects = projects;
  },
  activeProjects(state, activeProjects) {
    state.activeProjects = activeProjects;
  },
  updateProject(state, project) {
    state.projects.map((p) => {
      if (p.id === project.id) {
        Object.assign(p, project);
      }
      return state.projects;
    });
  },

  deliveryChains(state, deliveryChains) {
    state.delivery_chains = deliveryChains;
  },
  deliveryChainRoles(state, deliveryChainRoles) {
    state.delivery_chain_roles = deliveryChainRoles;
  },
  // Delivery Chanins for CMS Inventory page
  deliveryChainsCMS(state, deliveryChains) {
    state.deliveryChains = deliveryChains;
  },

  instances(state, instances) {
    state.instances = instances;
  },
  instanceTypes(state, instanceTypes) {
    state.instanceTypes = instanceTypes;
  },
  instanceStatus(state, instanceStatus) {
    state.instanceStatus = instanceStatus;
  },
  devInstances(state, devInstances) {
    state.devInstances = devInstances;
  },
  deployInstances(state, deployInstances) {
    state.deploy_instances = deployInstances;
  },
  environmentTypes(state, environmentTypes) {
    state.environmentTypes = environmentTypes;
  },

  operationType(state, operationType) {
    state.operationType = operationType;
  },
  binaryTypes(state, binaryTypes) {
    state.binaryTypes = binaryTypes;
  },
};
