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
  params(state, params) {
    state.params = params;
  },
  createParam(state, param) {
    const { params } = state;
    params.push(param);
    Vue.set(state, 'params', params);
  },
  updateParam(state, param) {
    state.params.map((x) => {
      if (x.id === param.id) {
        Vue.set(state.params, state.params.indexOf(x), param);
      }
      return state.params;
    });
  },
  deleteParam(state, id) {
    const params = state.params.filter((x) => x.id !== id);
    Vue.set(state, 'params', params);
  },
  hashes(state, hashes) {
    state.hashes = hashes;
  },
  feHashes(state, hashes) {
    state.feHashes = hashes;
  },
};
