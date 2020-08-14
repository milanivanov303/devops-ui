// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.mmpi.url, config.mmpi.code);

export default {
  async getProjects({ commit, state }, payload) {
    if (state.projects.length) {
      return;
    }
    try {
      const resp = await api.get('projects', payload);
      commit('projects', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
  async addRolesTmp({ commit }, payload) {
    try {
      const resp = await api.put(`projects/roles-tmp/${payload.id}`, payload.data);
      commit('updateProject', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
  async addRoles({ commit }, payload) {
    try {
      const resp = await api.put(`projects/roles/${payload.id}`, payload.data);
      commit('updateProject', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
};
