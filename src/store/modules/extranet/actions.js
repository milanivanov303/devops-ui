// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  async getClients({ commit, state }, payload) {
    if (state.clients.length) {
      return;
    }
    try {
      const response = await api.get('extranet/clients', payload);
      commit('clients', response.data);
    } catch (err) {
      commit('error', err);
    }
  },
  async getBranches({ commit, state }, payload) {
    if (state.branches.length) {
      return;
    }
    try {
      const response = await api.get('extranet/branches', payload);
      commit('branches', response.data);
    } catch (err) {
      commit('error', err);
    }
  },
  async getContainers({ commit }, payload) {
    try {
      const response = await api.get('extranet/containers', payload);
      commit('containers', response.data.data);
      commit('host', response.data.meta.host);
    } catch (err) {
      commit('error', err);
    }
  },
  startBuild({ commit }, payload) {
    const promise = api.post('extranet/build', payload);
    promise
      .then(response => commit('startBuild', response.data.data))
      .catch(error => commit('error', error));
    return promise; 
  },
  removeBuild({ commit }, id) {
    const promise = api.delete(`extranet/build/${id}`);
    promise
      .then(() => commit('removeBuild', id))
      .catch(error => commit('error', error));
    return promise; 
  },
};
