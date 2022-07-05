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
  x4params(state, x4params) {
    state.x4params = x4params;
  },
  createX4Param(state, x4param) {
    const { x4params } = state;
    x4params.push(x4param);
    Vue.set(state, 'x4params', x4params);
  },
  updateX4Param(state, x4param) {
    state.x4params.map((x) => {
      if (x.id === x4param.id) {
        Vue.set(state.x4params, state.x4params.indexOf(x), x4param);
      }
      return state.x4params;
    });
  },
  deleteX4Param(state, id) {
    const x4params = state.x4params.filter((x) => x.id !== id);
    Vue.set(state, 'x4params', x4params);
  },
  hashes(state, hashes) {
    state.hashes = hashes;
  },
  feHashes(state, hashes) {
    state.feHashes = hashes;
  },
};
