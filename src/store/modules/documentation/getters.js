// https://vuex.vuejs.org/en/getters.html

export default {
  getYamlFiles: (state) => state.specs.filter((file) => file.path.endsWith('.yaml') || file.path.endsWith('.yml')),
};
