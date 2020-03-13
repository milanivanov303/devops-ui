// https://vuex.vuejs.org/en/getters.html

export default {
  getBuildsByModule: state => (module) => {
    if (!state.builds) {
      return [];
    }
    return state.builds.filter(build => (
      build.module === module
    ));
  },
  getBuildsGroupedByModule: state => () => {
    const modules = {};
    state.moduleBuilds.forEach((build) => {
      modules[build.module] = (modules[build.module] + 1) || 1;
    });

    const builds = [];
    Object.keys(modules).forEach((module) => {
      builds.push({ module, builds: modules[module] });
    });

    return builds.sort((a, b) => b.builds - a.builds);
  },

  getBuildsGroupedByUser: state => (module) => {
    let filterBuilds = state.usersBuilds;
    if (typeof module !== 'undefined' && (module === 'extranet' || module === 'imx-fe')) {
      filterBuilds = state.usersBuilds.filter(build => build.module === module);
    }

    const users = {};
    filterBuilds.forEach((filterBuild) => {
      users[filterBuild.details.created_by] = (users[filterBuild.details.created_by] + 1) || 1;
    });

    const builds = [];
    Object.keys(users).forEach((user) => {
      builds.push({ user, builds: users[user] });
    });

    return builds.sort((a, b) => b.builds - a.builds);
  },

  getBuildsGroupedByBranch: state => (module) => {
    let filterBuilds = state.branchBuilds;
    if (typeof module !== 'undefined' && (module === 'extranet' || module === 'imx-fe')) {
      filterBuilds = state.branchBuilds.filter(build => build.module === module);
    }

    const branches = {};
    filterBuilds.forEach((filterBuild) => {
      branches[filterBuild.details.branch] = (branches[filterBuild.details.branch] + 1) || 1;
    });

    const builds = [];
    Object.keys(branches).forEach((branch) => {
      builds.push({ branch, builds: branches[branch] });
    });

    return builds.sort((a, b) => b.builds - a.builds);
  },

  getError: state => state.error,
};
