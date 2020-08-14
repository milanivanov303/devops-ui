// https://vuex.vuejs.org/en/getters.html

export default {
  getProjectRolesUsers: state => state.projects
    .map(p => ({
      project: p.name,
      PC: p.roles
        .filter(r => r.role_id === 'pc')
        .map(r => r.user.name).toString(),
      DPC: p.roles
        .filter(r => r.role_id === 'dpc')
        .map(r => r.user.name).toString(),
      ...p,
    })),
  getProjectRolesTemp: state => state.projects
    .map((p) => {
      const rolesPC = p.roles
        .filter(r => r.role_id === 'pc')
        .map(r => r.user);
      const rolesTmpPC = p.roles_tmp
        .filter(r => r.role_id === 'pc')
        .map(r => r.user);
      const rolesDPC = p.roles
        .filter(r => r.role_id === 'dpc')
        .map(r => r.user);
      const rolesTmpDPC = p.roles_tmp
        .filter(r => r.role_id === 'dpc')
        .map(r => r.user);
      return {
        project: p.name,
        PC: [...rolesTmpPC, ...rolesPC],
        DPC: [...rolesTmpDPC, ...rolesDPC],
        approved: p.roles_tmp
          .filter(r => r.role_id === 'pc').length > 0 || p.roles_tmp
          .filter(r => r.role_id === 'dpc').length > 0,
        ...p,
      };
    })
    .sort((a, b) => {
      // if both has roles_tmp sort by name
      if (a.roles_tmp.length > 0 && b.roles_tmp.length > 0) {
        return a.name.localeCompare(b.name);
      }
      if (a.roles_tmp.length > 0) {
        return -1;
      }
      if (b.roles_tmp.length > 0) {
        return 1;
      }
      // if both don't have roles_tmp sort by name
      return a.name.localeCompare(b.name);
    }),
  getRolePropertyName: state => payload => state.projects
    .filter(p => p.id === parseInt(payload.projectId, 0))
    .map((p) => {
      if (p.roles_tmp.some(r => r.user.name === payload.userName)) {
        return 'roles_tmp';
      }
      if (p.roles.some(r => r.user.name === payload.userName)) {
        return 'roles';
      }
      return null;
    })
    .pop(),
};
