import Vue from 'vue';

export default {
  active(state, builds) {
    state.active = builds;
  },
  statistics(state, { name, data }) {
    Vue.set(state.statistics, name, data);
  },
};
