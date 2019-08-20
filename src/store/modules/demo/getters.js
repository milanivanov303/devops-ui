// https://vuex.vuejs.org/en/getters.html

export default {
  getError: state => state.error,
  requstedDemos: state => state.demos.filter(demos => demos.status === 'requested'),
  demoKeys: state => state.demos,
};
