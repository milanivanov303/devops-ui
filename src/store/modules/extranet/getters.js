// https://vuex.vuejs.org/en/getters.html

export default {
  getContainersByBranch: state => (branch) => {
    if (!state.containers) {
      return [];
    }
    return state.containers.filter(container => (
      container.Labels.branch === branch
    ));
  },
  getContainersByUser: state => (username) => {
    if (!state.containers) {
      return [];
    }
    return state.containers.filter(container => (
      container.Labels.username === username
    ));
  },
  getContainersGroupedByBranch: state => () => {
    const branches = {};
    state.containers.forEach((container) => {
      branches[container.Labels.branch] = (branches[container.Labels.branch] + 1) || 1;
    });

    const containers = [];
    Object.keys(branches).forEach((branch) => {
      containers.push({ branch, builds: branches[branch] });
    });

    return containers.sort((a, b) => b.builds - a.builds);
  },

  getError: state => state.error,
};
