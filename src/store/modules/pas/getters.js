// https://vuex.vuejs.org/en/getters.html

export default {
  getConfigurations: (state) => state.configurations,
  getX4ParamsByType: (state) => (type) => {
    if (!state.x4params) {
      return [];
    }
    return state.x4params.filter((x) => x.type === type);
  },
};
