// https://vuex.vuejs.org/en/getters.html

export default {
  getError: state => state.error,
  requstedDemos: state => state.demos.filter(demos => demos.status === 'requested'),
  demo: state => demo => state.demos.filter(demos => demos.id === demo),
  demos: state => state.demos,

  getAllByStatus: state => (stateName) => {
    if (!state.demos[stateName]) {
      return [];
    }

    return state.demos[stateName].reduce(
      (tally, demo) => {
        if (demo.status === 'requested' || demo.status === 'rejected' || demo.status === 'active') {
          tally[demo.status] = (tally[demo.status] || 0) + 1;
        };
        return tally;
      },
      {},
    );
  },

  getByStatus: state => (stateName, status, dates) => {
    if (!state.demos[stateName]) {
      return [];
    }
    return dates.reduce(
      (tally, date) => {
        state.demos[stateName].find(demo => {
          if (demo.status === status) {
            if (date === "".concat(new Date(demo.active_from).getUTCFullYear() + "-" + (new Date (demo.active_from).getMonth()+1) + "-" + new Date (demo.active_from).getDate())) {
              tally[date] = (tally[date] || 0) + 1;
            } else {
              tally[date] = 0; 
            }
          }
        });
        return tally;
      },
      {},
    )
  },
};

