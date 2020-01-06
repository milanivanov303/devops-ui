// https://vuex.vuejs.org/en/mutations.html
import Vue from 'vue';

export default {
  error(state, error) {
    state.error = error;
  },
  userPermissions(state, permissions) {
    state.userPermissions = permissions;
  },
};
