// https://vuex.vuejs.org/en/actions.html
// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  async getClients({ commit }, payload) {
    try {
      const response = await api.get('extranet/clients', payload);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async getBranches({ commit }, payload) {
    try {
      const response = await api.get('extranet/branches', payload);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async getContainers({ commit }, payload) {
    try {
      payload = {
        'filters': JSON.stringify({
          'label': ['type=extranet'],
          'status': ['created', 'restarting', 'running', 'removing', 'paused', 'exited', 'dead'],
        })
      };
      const response = await api.get('docker/containers', payload);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async startBuild({ commit }, payload) {
    try {
      const response = await api.post('extranet/build/start', payload);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async checkBuild({ commit }, payload) {
    try {
      const response = await api.post('extranet/build/check', payload);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async deployBuild({ commit }, payload) {
    try {
      const response = await api.post('extranet/build/deploy', payload);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async deployedBuild({ commit }, payload) {
    try {
      const response = await api.get(`extranet/build/deployed-builds?host=${payload.host}&port=${payload.port}`);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async createContainer({ commit }, payload) {
    try {
      const response = await api.post(`docker/containers/${payload.container}`, payload.data);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async startContainer({ commit }, payload) {
    try {
      const response = await api.post(`docker/containers/start/${payload.container}`);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async stopContainer({ commit }, payload) {
    try {
      const response = await api.post(`docker/containers/stop/${payload.container}`);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
  async getContainer({ commit }, payload) {
    try {
      const response = await api.get(`docker/containers/${payload.container}`);
      return response.data;
    } catch (err) {
      return commit('error', err);
    }
  },
};
