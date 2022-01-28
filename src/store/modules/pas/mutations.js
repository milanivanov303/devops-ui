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
  hashes(state, hashes) {
    state.hashes = hashes;
  },
  feHashes(state, hashes) {
    state.feHashes = hashes;
  },
};
