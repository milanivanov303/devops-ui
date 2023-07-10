// https://vuex.vuejs.org/en/getters.html

export default {
  // slice() used to create shallow copy to avoid re-rendering
  getConfigurations: (state) => state.configurations.slice().sort((a, b) => {
    if (a.created_on < b.created_on) {
      return 1;
    }
    if (a.created_on > b.created_on) {
      return -1;
    }
    return 0;
  }),
};
