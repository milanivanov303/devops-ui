// https://vuex.vuejs.org/en/mutations.html

import Vue from 'vue';

export default {
  branches(state, branches) {
    state.branches = branches;
  },
  host(state, host) {
    state.host = host;
  },
  clients(state, clients) {
    state.clients = clients;
  },
  feBranches(state, branches) {
    state.feBranches = branches;
  },
  removeBuild(state, id) {
    state.services.splice(
      state.services.findIndex(service => service.ID === id),
      1,
    );
  },
  configurations(state, configurations) {
    state.configurations = configurations;
  },
  createConfiguration(state, configuration) {
    const { configurations } = state;
    configurations.push(configuration);
    Vue.set(state, 'configurations', configurations);
  },
  updateConfiguration(state, configuration) {
    state.configurations.map((d) => {
      if (d.id === configuration.id) {
        Vue.set(state.configurations, state.configurations.indexOf(d), configuration);
      }
      return state.configurations;
    });
  },
  deleteConfiguration(state, id) {
    const configurations = state.configurations.filter(d => d.id !== id);
    Vue.set(state, 'configurations', configurations);
  },
  apiDocumentation(state, api) {
    state.apiDocumentation = api;
  },
  raml(state, raml) {
    state.raml = raml;
  },
};
