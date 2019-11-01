// https://vuex.vuejs.org/en/getters.html

export default {
  getContainersByBranch: state => branch => {
    if (!state.containers) {
      return [];
    }
    return state.containers.filter(container => (
      container.Labels.branch === branch
    ));
  },
  getError: state => state.error,
};
