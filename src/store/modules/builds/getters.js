// https://vuex.vuejs.org/en/getters.html

function sortBuilds(builds) {
  const sorted = Object.entries(builds).sort((a, b) => b[1] - a[1]);

  return sorted.reduce(
    (tally, build) => {
      tally[build[0]] = build[1]; // eslint-disable-line
      return tally;
    },
    {},
  );
}

export default {
  getActiveByUser: (state) => (username, module) => {
    if (!state.active) {
      return [];
    }
    return state.active.filter((build) => {
      if (module && build.module !== module) {
        return false;
      }
      return build.created_by === username;
    });
  },

  getActiveGroupedByBranch: (state) => (module) => {
    const branches = {};
    state
      .active
      .filter((build) => build.module === module)
      .forEach((build) => {
        if (!branches[build.details.branch]) {
          branches[build.details.branch] = {};
        }
        branches[build.details.branch][build.status] = branches[build.details.branch][build.status]
        + 1 || 1;
      });

    const builds = [];
    Object.keys(branches).forEach((branch) => {
      builds.push({ branch, builds: branches[branch] });
    });

    return builds.sort((a, b) => b.builds - a.builds);
  },
  getTTSkeysFromActiveBuilds: (state) => (module) => {
    const ttsKeys = [];
    state.active.filter((build) => build.module === module)
      .forEach((build) => {
        if (!ttsKeys.includes(build.details.tts_key)) {
          ttsKeys.push(build.details.tts_key);
        }
      });
    return ttsKeys;
  },
  getActiveGroupedByTTSkey: (state) => (module) => {
    const ttsKeys = {};
    state
      .active
      .filter((build) => build.module === module)
      .forEach((build) => {
        if (!ttsKeys[build.details.tts_key]) {
          ttsKeys[build.details.tts_key] = {};
        }
        ttsKeys[build.details.tts_key][build.status] = ttsKeys[build.details.tts_key][build.status]
        + 1 || 1;
      });

    const builds = [];
    Object.keys(ttsKeys).forEach((ttsKey) => {
      builds.push({ ttsKey, builds: ttsKeys[ttsKey] });
    });

    return builds.sort((a, b) => b.builds - a.builds);
  },
  getActiveGroupedByModule: (state) => {
    const branches = {};
    state
      .active
      .forEach((build) => {
        if (!branches[build.module]) {
          branches[build.module] = {};
        }
        branches[build.module][build.status] = branches[build.module][build.status] + 1 || 1;
      });

    const builds = [];
    Object.keys(branches).forEach((module) => {
      builds.push({ module, builds: branches[module] });
    });

    return builds.sort((a, b) => b.builds - a.builds);
  },

  getActiveByBranch: (state) => (branch) => {
    if (!state.active) {
      return [];
    }
    return state.active.filter((build) => build.details.branch === branch);
  },
  getActiveByTTSkey: (state) => (key) => {
    if (!state.active) {
      return [];
    }
    return state.active.filter((build) => build.details.tts_key === key);
  },

  getByModule: (state) => (stateName) => {
    if (!state.statistics[stateName]) {
      return [];
    }

    const builds = state.statistics[stateName].reduce(
      (tally, build) => {
        tally[build.module] = (tally[build.module] || 0) + 1;
        return tally;
      },
      {},
    );

    return sortBuilds(builds);
  },
  getByTTSkey: (state) => (stateName, module) => {
    if (!state.statistics[stateName]) {
      return [];
    }

    const builds = state.statistics[stateName].reduce(
      (tally, build) => {
        if (!module || build.module === module) {
          tally[build.details.tts_key] = (tally[build.details.tts_key] || 0) + 1;
        }
        return tally;
      },
      {},
    );

    return sortBuilds(builds);
  },
  getByUser: (state) => (stateName, module) => {
    if (!state.statistics[stateName]) {
      return [];
    }

    const builds = state.statistics[stateName].reduce(
      (tally, build) => {
        if (!module || build.module === module) {
          tally[build.created_by] = (tally[build.created_by] || 0) + 1;
        }
        return tally;
      },
      {},
    );

    return sortBuilds(builds);
  },
  getByBranch: (state) => (stateName, module) => {
    if (!state.statistics[stateName]) {
      return [];
    }

    const builds = state.statistics[stateName].reduce(
      (tally, build) => {
        if (!module || build.module === module) {
          tally[build.details.branch] = (tally[build.details.branch] || 0) + 1;
        }
        return tally;
      },
      {},
    );

    return sortBuilds(builds);
  },

  getForBranch: (state) => (stateName, branch) => {
    if (!state.statistics[stateName]) {
      return [];
    }

    return state.statistics[stateName].filter((build) => {
      if (build.details.branch === branch) {
        return true;
      }
      return false;
    });
  },
  getForUser: (state) => (stateName, user) => {
    if (!state.statistics[stateName]) {
      return [];
    }

    return state.statistics[stateName].filter((build) => {
      if (build.created_by === user) {
        return true;
      }
      return false;
    });
  },
  paginationData: (state) => state.paginationData,

};
