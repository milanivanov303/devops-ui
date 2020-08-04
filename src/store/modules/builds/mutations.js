import Vue from 'vue';

export default {
  active(state, builds) {
    state.active = builds;
  },

  statistics(state, { name, data }) {
    Vue.set(state.statistics, name, data);
  },

  markAsRunning(state, id) {
    const build = state.active.find(build => build.id === id);
    build.status = 'running';
  },

  markAsStopped(state, id) {
    const build = state.active.find(build => build.id === id);
    build.status = 'stopped';
  },
};
