// https://vuex.vuejs.org/en/getters.html

export default {
  getContainersByBranch: state => (branch) => {
    if (!state.containers) {
      return [];
    }
    return state.containers.filter(container => (
      container.Labels.branch === branch
    ));
  },
  getContainersByUser: state => (username) => {
    if (!state.containers) {
      return [];
    }
    return state.containers.filter(container => (
      container.Labels.username === username
    ));
  },
  getContainersGroupedByBranch: state => () => {
    const branches = {};
    state.containers.forEach((container) => {
      branches[container.Labels.branch] = (branches[container.Labels.branch] + 1) || 1;
    });

    const containers = [];
    Object.keys(branches).forEach((branch) => {
      containers.push({ branch, builds: branches[branch] });
    });

    return containers.sort((a, b) => b.builds - a.builds);
  },
  getCurrentMonthBuildsGroupedByBranch: state => () => {  
    let monthBuilds = [];
    let currentDate = new Date();

    state.builds.forEach((allBuild) => {
      let buildDate = new Date(allBuild.created_on * 1000);
      if(currentDate.getYear() === buildDate.getYear() && currentDate.getMonth() === buildDate.getMonth() && allBuild.module === 'imx-fe') {
        monthBuilds.push(allBuild); 
      }            
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
  
  getCurrentMonthBuildsGroupedByUser: state => () => {
    let monthBuilds = [];
    let currentDate = new Date();

    state.builds.forEach((allBuild) => {
      let buildDate = new Date(allBuild.created_on * 1000);
      if(currentDate.getYear() === buildDate.getYear() && currentDate.getMonth() === buildDate.getMonth() && allBuild.module === 'imx-fe') {
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
  
};
