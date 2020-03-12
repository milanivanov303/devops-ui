export default {
  host(state, host) {
    state.host = host;
  },
  builds(state, builds) {
    state.builds = builds;
  },
  moduleBuilds(state, moduleBuilds) {
    state.moduleBuilds = moduleBuilds;
  },
  usersBuilds(state, usersBuilds) {
    state.usersBuilds = usersBuilds;
  },
  error(state, error) {
    state.error = error;
  },
};
