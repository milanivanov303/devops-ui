// https://vuex.vuejs.org/en/mutations.html

export default {
  branches(state, branches) {
    state.branches = branches;
  },
  host(state, host) {
    state.host = host;
  },
  builds(state, builds) {
    state.builds = builds;
  },
  error(state, error) {
    state.error = error;
  },
  removeBuild(state, id) {
    state.containers.splice(
      state.containers.findIndex((container) => container.Id === id),
      1,
    );
  },
  client(state, client) {
    state.client = client;
  },
};  