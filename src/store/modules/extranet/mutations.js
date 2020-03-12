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
  clients(state, clients) {
    state.clients = clients;
  },
  feBranches(state, feBranches) {
    state.feBranches = feBranches;
  },
  error(state, error) {
    state.error = error;
  },
  startBuild(state, build) {
    builds.push(build);
    Vue.set(state, 'builds', builds);
  },
  removeBuild(state, id) {
    state.builds.splice(
      state.builds.findIndex((build) => build.id === id),
      1,
    );
  },
};
