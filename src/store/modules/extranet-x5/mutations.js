// https://vuex.vuejs.org/en/mutations.html

export default {
  branches(state, branches) {
    state.branches = branches;
  },
  host(state, host) {
    state.host = host;
  },
  removeBuild(state, id) {
    state.services.splice(
      state.services.findIndex((service) => service.ID === id),
      1,
    );
  },
};
