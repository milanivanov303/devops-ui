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
  configurations(state, configurations) {
    state.configurations = configurations;
  },
  error(state, error) {
    state.error = error;
  },
};
