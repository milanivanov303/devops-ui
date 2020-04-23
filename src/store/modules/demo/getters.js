// https://vuex.vuejs.org/en/getters.html

export default {
  getError: state => state.error,
  requstedDemos: state => state.demos.filter(demos => demos.status === 'requested'),
  demo: state => demo => state.demos.filter(demos => demos.id === demo),
  demos: state => state.demos,

  getAllByStatus: state => (status) => {
    if (!state.demos) {
      return [];
    }

    return state.demos.reduce(
      (tally, demo) => {
        if (demo.status === 'requested' || demo.status === 'rejected' || demo.status === 'active') {
          tally[demo.status] = (tally[demo.status] || 0) + 1;
        };
        return tally;
      },
      {},
    );
  },

  // getByStatus: state => () => {
  //   debugger;
  //   if (!state.demos) {
  //     return [];
  //   }

  //   return state.demos.reduce(
  //     (tally, demo) => {
  //       if (demo.status === 'active') {
  //         tally[demo.active_from] = (tally[demo.active_from] || 0) + 1;
  //       };
  //       return tally;
  //     },
  //     {},
  //   );
  // }
};

