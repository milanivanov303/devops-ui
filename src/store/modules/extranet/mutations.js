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
  fe_branches(state, fe_branches) {
    state.fe_branches = fe_branches;
  },
  error(state, error) {
    state.error = error;
  },
};
