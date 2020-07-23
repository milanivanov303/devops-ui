import Vue from 'vue';

export default {
  active(state, builds) {
    state.active = builds;
  },
  statistics(state, { name, data }) {
    Vue.set(state.statistics, name, data);
  },
  builds(state, { status, builds }) {
    Vue.set(state.builds, status, builds);
  },
};
