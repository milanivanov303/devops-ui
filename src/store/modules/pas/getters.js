// https://vuex.vuejs.org/en/getters.html

export default {
  getX4ParamsByType: (state) => (type) => {
    if (!state.x4params) {
      return [];
    }
    return state.x4params.filter((x) => x.type === type);
  },
  getConfigurations: (state) => state.configurations.sort((a, b) => {
    if (a.created_on < b.created_on) {
      return 1;
    }
    if (a.created_on > b.created_on) {
      return -1;
    }
    return 0;
  }),
};
