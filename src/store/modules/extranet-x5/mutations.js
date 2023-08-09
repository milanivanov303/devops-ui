// https://vuex.vuejs.org/en/mutations.html

export default {
  branches(state, branches) {
    state.branches = branches;
  },
  host(state, host) {
    state.host = host;
  },
  be_url(state, url) {
    state.be_url = url;
  },
  removeBuild(state, id) {
    state.services.splice(
      state.services.findIndex((service) => service.ID === id),
      1,
    );
  },
};
