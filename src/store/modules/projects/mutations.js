// https://vuex.vuejs.org/en/mutations.html

export default {
  error(state, error) {
    state.error = error;
  },
  projects(state, projects) {
    state.projects = projects;
  },
  updateProject(state, project) {
    state.projects.map((p) => {
      if (p.id === project.id) {
        Object.assign(p, project);
      }
      return state.projects;
    });
  },
};
