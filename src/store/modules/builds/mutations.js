import Vue from 'vue';

export default {
  active(state, builds) {
    state.active = builds;
  },

  statistics(state, { name, data }) {
    Vue.set(state.statistics, name, data);
  },

  update(state, build) {
    state.active.map((a) => {
      if (a.id === build.id) {
        Vue.set(state.active, state.active.indexOf(a), build);
      }
      return state.active;
    });
  },

  remove(state, id) {
    state.active.splice(
      state.active.findIndex((build) => build.id === id),
      1,
    );
  },
};
