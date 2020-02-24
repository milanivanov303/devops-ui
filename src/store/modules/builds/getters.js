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
  getCurrentMonthBuilds: state => () => {
    let builds = state.builds;
    let monthBuilds = [];
    let currentDate = new Date();

    builds.forEach((build) => {
      let buildDate = new Date(build.created_on * 1000);
      if(currentDate.getYear() === buildDate.getYear() && currentDate.getMonth() === buildDate.getMonth() ) {
        monthBuilds.push(build); 
      }            
    });

    return monthBuilds;
  },
  getCurrentMonthBuildsGroupedByModule: state => () => {
    let allBuilds = state.builds;
    let monthBuilds = [];
    let currentDate = new Date();

    allBuilds.forEach((allBuild) => {
      let buildDate = new Date(allBuild.created_on * 1000);
      if(currentDate.getYear() === buildDate.getYear() && currentDate.getMonth() === buildDate.getMonth() ) {
        monthBuilds.push(allBuild); 
      }            
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
  getCurrentMonthBuildsGroupedByUser: state => () => {
    let allBuilds = state.builds;
    let monthBuilds = [];
    let currentDate = new Date();

    allBuilds.forEach((allBuild) => {
      let buildDate = new Date(allBuild.created_on * 1000);
      if(currentDate.getYear() === buildDate.getYear() && currentDate.getMonth() === buildDate.getMonth() ) {
        monthBuilds.push(allBuild); 
      }            
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
  
  getError: state => state.error,
};

