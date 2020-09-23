import Vue from 'vue';

export default {
  active(state, builds) {
    state.active = builds;
  },

  statistics(state, { name, data }) {
    Vue.set(state.statistics, name, data);
  },

  start(state, id) {
    state.active.map((a) => {
      if (a.id === id) {
        a.status = 'running';
      }
      return state.active;
    });
  },
  stop(state, id) {
    state.active.map((a) => {
      if (a.id === id) {
        a.status = 'stopped';
      }
      return state.active;
    });
  },
  remove(state, id) {
    state.active.splice(
      state.active.findIndex(build => build.id === id),
      1,
    );

  },
};
