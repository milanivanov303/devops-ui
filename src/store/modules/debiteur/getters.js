// https://vuex.vuejs.org/en/getters.html

export default {
  getServicesByUser: state => (username) => {
    if (!state.services) {
      return [];
    }
    return state.services.filter(service => service.Spec.Labels.username === username);
  },
};
