// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getClients({ commit }, payload) {
    return api.get('extranet/clients', payload)
      .catch((err) => {
        commit('err', err);
      });
  },
  getBranches({ commit }, payload) {
    return api.get('extranet/branches', payload)
      .catch((err) => {
        commit('err', err);
      });
  },
  startBuild({ commit }, payload) {
    return api.post('extranet/build/start', payload)
      .catch((err) => {
        commit('err', err);
      });
  },
  checkBuild({ commit }, payload) {
    return api.post('extranet/build/check', payload)
      .catch((err) => {
        commit('err', err);
      });
  },
  deployBuild({ commit }, payload) {
    return api.post('extranet/build/deploy', payload)
      .catch((err) => {
        commit('err', err);
      });
  },
  deployedBuild({ commit }, payload) {
    return api.get(`extranet/build/deployed-builds?host=${payload.host}&port=${payload.port}`)
      .catch((err) => {
        commit('err', err);
      });
  },
  createContainer({ commit }, payload) {
    return api.post(`docker/containers/${payload.container}`, payload.data)
      .catch((err) => {
        commit('err', err);
      });
  },
  startContainer({ commit }, payload) {
    return api.post(`docker/containers/start/${payload.container}`)
      .catch((err) => {
        commit('err', err);
      });
  },
  stopContainer({ commit }, payload) {
    return api.post(`docker/containers/stop/${payload.container}`)
      .catch((err) => {
        commit('err', err);
      });
  },
  getContainer({ commit }, payload) {
    return api.get(`docker/containers/${payload.container}`)
      .catch((err) => {
        commit('err', err);
      });
  },
};
