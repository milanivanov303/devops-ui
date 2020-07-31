// https://vuex.vuejs.org/en/mutations.html
import Vue from 'vue';

export default {
  error(state, error) {
    state.error = error;
  },
  fillDemos(state, demos) {
    state.demos = demos;
  },
  demos(state, { name, data }) {
    Vue.set(state.statDemos, name, data);
  },
  createDemo(state, demo) {
    const { demos } = state;
    demos.push(demo);
    Vue.set(state, 'demos', demos);
  },
  updateDemo(state, demo) {
    state.demos.map((d) => {
      if (d.id === demo.id) {
        Vue.set(state.demos, state.demos.indexOf(d), demo);
      }
      return state.demos;
    });
  },
  demosExport(state, demos) {
    state.demos = demos;
  },
};
