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
  
  getBuildsDateFilteredGroupedByModule: state => numberOfBuilds => {
    let startDate = new Date(new Date().setTime(new Date().getTime() - (numberOfBuilds * 24 * 60 * 60 * 1000))).getTime();          
    
    let filterBuilds = state.builds.filter(build => {
        return new Date(build.created_on * 1000).getYear() === new Date().getYear() && new Date(build.created_on * 1000).getTime() > startDate;               
    });   

    const modules = {};
    filterBuilds.forEach((filterBuild) => {
      modules[filterBuild.module] = (modules[filterBuild.module] + 1) || 1;
    });

    const builds = [];
    Object.keys(modules).forEach((module) => {
      builds.push({ module, builds: modules[module] });
    });

    return builds.sort((a, b) => b.build - a.build);
  },
  
  getBuildsDateFilteredGroupedByUser: state => (numberOfBuilds, module) => {
    let startDate = new Date(new Date().setTime(new Date().getTime() - (numberOfBuilds * 24 * 60 * 60 * 1000))).getTime();          
    
    let filterBuilds = state.builds.filter(build => {           
        if( typeof module !== 'undefined' && (module === 'extranet' || module === 'imx-fe') ) {
          return new Date(build.created_on * 1000).getYear() === new Date().getYear() && new Date(build.created_on * 1000).getTime() > startDate && build.module === module;
        }
        return new Date(build.created_on * 1000).getYear() === new Date().getYear() && new Date(build.created_on * 1000).getTime() > startDate;
    });      

    const users = {};
    filterBuilds.forEach((filterBuild) => {
      users[filterBuild.details.created_by] = (users[filterBuild.details.created_by] + 1) || 1;
    });

    const builds = [];
    Object.keys(users).forEach((user) => {
      builds.push({ user, builds: users[user] });
    });

    return builds.sort((a, b) => b.build - a.build);
  },
  
  getBuildsDateFilteredGroupedByBranch: state => (numberOfBuilds, module) => {
    let startDate = new Date(new Date().setTime(new Date().getTime() - (numberOfBuilds * 24 * 60 * 60 * 1000))).getTime();          
    
    let filterBuilds = state.builds.filter(build => {           
        if( typeof module !== 'undefined' && (module === 'extranet' || module === 'imx-fe') ) {
          return new Date(build.created_on * 1000).getYear() === new Date().getYear() && new Date(build.created_on * 1000).getTime() > startDate && build.module === module;
        }
        return new Date(build.created_on * 1000).getYear() === new Date().getYear() && new Date(build.created_on * 1000).getTime() > startDate;
    });      

    const branches = {};
    filterBuilds.forEach((filterBuild) => {
      branches[filterBuild.details.branch] = (branches[filterBuild.details.branch] + 1) || 1;
    });
    
    const builds = [];
    Object.keys(branches).forEach((branch) => {
      builds.push({ branch, builds: branches[branch] });
    });
    
    return builds.sort((a, b) => b.build - a.build);
  },
  
  getError: state => state.error,
};

