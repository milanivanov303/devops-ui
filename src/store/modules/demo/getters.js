// https://vuex.vuejs.org/en/getters.html

export default {
  getError: state => state.error,
  requstedDemos: state => state.demos.filter(demos => demos.status === 'requested'),
  demo: state => demo => state.demos.filter(demos => demos.id === demo),
  demos: state => state.demos,
};
