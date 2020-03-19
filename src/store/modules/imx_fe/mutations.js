// https://vuex.vuejs.org/en/mutations.html

export default {
  branches(state, branches) {
    state.branches = branches;
  },
  containers(state, containers) {
    state.containers = containers;
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
};
