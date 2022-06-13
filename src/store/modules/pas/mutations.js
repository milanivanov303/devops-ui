// https://vuex.vuejs.org/en/mutations.html

import Vue from 'vue';

export default {
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
    const configurations = state.configurations.filter((d) => d.id !== id);
    Vue.set(state, 'configurations', configurations);
  },
  clients(state, clients) {
    state.clients = clients;
  },
  createClient(state, client) {
    const { clients } = state;
    clients.push(client);
    Vue.set(state, 'clients', clients);
  },
  updateClient(state, client) {
    state.clients.map((c) => {
      if (c.id === client.id) {
        Vue.set(state.clients, state.clients.indexOf(c), client);
      }
      return state.clients;
    });
  },
  deleteClient(state, id) {
    const clients = state.clients.filter((c) => c.id !== id);
    Vue.set(state, 'clients', clients);
  },
  hashes(state, hashes) {
    state.hashes = hashes;
  },
  feHashes(state, hashes) {
    state.feHashes = hashes;
  },
};
