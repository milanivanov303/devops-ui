// https://vuex.vuejs.org/en/mutations.html
import Vue from 'vue';

export default {
  promise(state, { name, promise }) {
    state.promises[name] = promise;
  },
  hasError(state, hasError) {
    state.hasError = hasError;
  },
  error(state, error) {
    state.error = error;
  },
  user(state, user) {
    state.user = user;
  },
  users(state, users) {
    state.users = users;
  },
  roles(state, roles) {
    state.roles = roles;
  },
  actions(state, actions) {
    state.actions = actions;
  },
  addRole(state, role) {
    const { roles } = state;
    roles.push(role);
    Vue.set(state, 'roles', roles);
  },
  updateRole(state, role) {
    state.roles.map((r) => {
      if (r.id === role.id) {
        Vue.set(state.roles, state.roles.indexOf(r), role);
      }
      return state.roles;
    });
  },
  deleteRole(state, id) {
    state.roles.splice(
      state.roles.findIndex(role => role.id === id),
      1,
    );
  },
  updateUserRoles(state, user) {
    state.users.map((u) => {
      if (u.id === user.id) {
        Vue.set(state.users, state.users.indexOf(u), user);
      }
      return state.users;
    });
  },
};
