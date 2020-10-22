// https://vuex.vuejs.org/en/getters.html

export default {
  getError: state => state.error,
  getInstances: state => state.instances,
  getDeployInstances: state => state.deploy_instances,
};
