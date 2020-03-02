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
    state.builds.forEach((build) => {
      modules[build.module] = (modules[build.module] + 1) || 1;
    });

    const builds = [];
    Object.keys(modules).forEach((module) => {
      builds.push({ module, builds: modules[module] });
    });

    return builds.sort((a, b) => b.builds - a.builds);
  },
  getCurrentMonthBuildsGroupedByModule: state => () => {
    let currentDate = new Date();
    let monthBuilds = state.builds.filter(build => { 
        return currentDate.getYear() === new Date(build.created_on * 1000).getYear() && currentDate.getMonth() === new Date(build.created_on * 1000).getMonth();          
    });

    const modules = {};
    monthBuilds.forEach((monthBuild) => {
      modules[monthBuild.module] = (modules[monthBuild.module] + 1) || 1;
    });

    const builds = [];
    Object.keys(modules).forEach((module) => {
      builds.push({ module, builds: modules[module] });
    });

    return builds.sort((a, b) => b.build - a.build);
  },
  getCurrentMonthBuildsGroupedByUser: state => module => {
    let currentDate = new Date();
    let monthBuilds = state.builds.filter(build => {
        if( typeof module !== 'undefined' && (module === 'extranet' || module === 'imx-fe') ) {
          return currentDate.getYear() === new Date(build.created_on * 1000).getYear() && currentDate.getMonth() === new Date(build.created_on * 1000).getMonth() && build.module === module;
        }
        return currentDate.getYear() === new Date(build.created_on * 1000).getYear() && currentDate.getMonth() === new Date(build.created_on * 1000).getMonth();
    });

    const users = {};
    monthBuilds.forEach((monthBuild) => {
      users[monthBuild.details.created_by] = (users[monthBuild.details.created_by] + 1) || 1;
    });

    const builds = [];
    Object.keys(users).forEach((user) => {
      builds.push({ user, builds: users[user] });
    });

    return builds.sort((a, b) => b.build - a.build);
  },
  getCurrentMonthBuildsGroupedByBranch: state => module => {   
    let currentDate = new Date();
    let monthBuilds = state.builds.filter(build => { 
      return currentDate.getYear() === new Date(build.created_on * 1000).getYear() && currentDate.getMonth() === new Date(build.created_on * 1000).getMonth() && build.module === module; 
    });
    
    const branches = {};
    monthBuilds.forEach((monthBuild) => {
      branches[monthBuild.details.branch] = (branches[monthBuild.details.branch] + 1) || 1;
    });
    
    const builds = [];
    Object.keys(branches).forEach((branch) => {
      builds.push({ branch, builds: branches[branch] });
    });
    
    return builds.sort((a, b) => b.build - a.build);
  },
  
  getError: state => state.error,
};

