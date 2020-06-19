// https://vuex.vuejs.org/en/mutations.html

import Vue from 'vue';

export default {
  branches(state, branches) {
    state.branches = branches;
  },
  services(state, services) {
    state.services = services;
  },
  host(state, host) {
    state.host = host;
  },
  clients(state, clients) {
    state.clients = clients;
  },
  removeBuild(state, id) {
    state.services.splice(
      state.services.findIndex(service => service.ID === id),
      1,
    );
  },
};
