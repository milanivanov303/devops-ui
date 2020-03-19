import Vue from 'vue';

export default {
  builds(state, { name, data }) {
    Vue.set(state.builds, name, data);
  },
};
