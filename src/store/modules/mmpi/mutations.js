// https://vuex.vuejs.org/en/mutations.html

export default {
  instances(state, instances) {
    state.instances = instances;
  },
  deployInstances(state, deployInstances) {
    state.deploy_instances = deployInstances;
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
  updateProject(state, project) {
    state.projects.map((p) => {
      if (p.id === project.id) {
        Object.assign(p, project);
      }
      return state.projects;
    });
  },
  devInstances(state, devInstances) {
    state.devInstances = devInstances;
  },
};
