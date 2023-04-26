// https://vuex.vuejs.org/en/mutations.html

export default {
  error(state, error) {
    state.error = error;
  },
  projects(state, projects) {
    state.projects = projects;
  },
  instances(state, instances) {
    state.instances = instances;
  },

  // DevOps Matrix
  appVersions(state, versions) {
    state.app_versions = versions;
  },
  deployInstances(state, deployInstances) {
    state.deploy_instances = deployInstances;
  },
  binaryTypes(state, binaryTypes) {
    state.binaryTypes = binaryTypes;
  },

  // Delivery Chanins for CMS Inventory page
  deliveryChainsCMS(state, deliveryChains) {
    state.deliveryChains = deliveryChains;
  },
  devInstances(state, devInstances) {
    state.devInstances = devInstances;
  },

  // Modifications Tab
  operationType(state, operationType) {
    state.operationType = operationType;
  },
  miscellaneous(state, miscellaneous) {
    state.miscellaneous = miscellaneous;
  },
  instanceStatus(state, instanceStatus) {
    state.instanceStatus = instanceStatus;
  },

  // Request instance tab
  requestProjects(state, requestProjects) {
    state.requestProjects = requestProjects;
  },
  deliveryChainRoles(state, deliveryChainRoles) {
    state.delivery_chain_roles = deliveryChainRoles;
  },
  environmentTypes(state, environmentTypes) {
    state.environmentTypes = environmentTypes;
  },
};
