// https://vuex.vuejs.org/en/getters.html

export default {
  getByModule: state => (stateName) => {
    if (!state.builds[stateName]) {
      return [];
    }

    return state.builds[stateName].reduce(
      (tally, build) => {
        tally[build.module] = (tally[build.module] || 0) + 1;
        return tally;
      },
      {},
    );
  },
  getByUser: state => (stateName, module) => {
    if (!state.builds[stateName]) {
      return [];
    }

    return state.builds[stateName].reduce(
      (tally, build) => {
        if (!module || build.module === module) {
          tally[build.details.created_by] = (tally[build.details.created_by] || 0) + 1;
        }
        return tally;
      },
      {},
    );
  },
  getByBranch: state => (stateName, module) => {
    if (!state.builds[stateName]) {
      return [];
    }

    return state.builds[stateName].reduce(
      (tally, build) => {
        if (!module || build.module === module) {
          tally[build.details.branch] = (tally[build.details.branch] || 0) + 1;
        }
        return tally;
      },
      {},
    );
  },

  getForBranch: state => (stateName, branch) => {
    if (!state.builds[stateName]) {
      return [];
    }

    return state.builds[stateName].filter((build) => {
      if (build.details.branch === branch) {
        return true;
      }
      return false;
    });
  },
  getForUser: state => (stateName, user) => {
    if (!state.builds[stateName]) {
      return [];
    }

    return state.builds[stateName].filter((build) => {
      if (build.details.created_by === user) {
        return true;
      }
      return false;
    });
  },
};
