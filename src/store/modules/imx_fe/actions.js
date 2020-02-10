// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  async getBranches({ commit, state }, payload) {
    if (state.branches.length) {
      return;
    }
    try {
      const response = await api.get('imx-fe/branches', payload);
      commit('branches', response.data);
    } catch (err) {
      commit('error', err);
    }
  },
  async getContainers({ commit }, payload) {
    try {
      const response = await api.get('imx-fe/containers', payload);
      commit('containers', response.data.data);
      commit('host', response.data.meta.host);
    } catch (err) {
      commit('error', err);
    }
  },
  startBuild({ commit }, payload) {
    try {
      return api.post('imx-fe/build', payload);
    } catch (err) {
      return commit('error', err);
    }
  },
  removeBuild({ commit }, id) {
    try {
      return api.delete(`imx-fe/build/${id}`);
    } catch (err) {
      return commit('error', err);
    }
  },
};
