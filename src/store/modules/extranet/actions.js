// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getClients({ commit }) {
    const promise = api.get('extranet/clients');

    promise
      .then(response => commit('clients', response.data))
      .catch(() => commit('error', 'Could not get clients list'));
    return promise;
  },

  getBranches({ commit }) {
    const promise = api.get('extranet/branches');

    promise
      .then(response => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list'));
    return promise;
  },

  getContainers({ commit }) {
    const promise = api.get('extranet/containers');

    promise
      .then((response) => {
        commit('containers', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get containers list'));
    return promise;
  },

  getFebranches({ commit }) {
    const promise = api.get('extranet/fe-branches');

    promise
      .then(response => commit('feBranches', response.data))
      .catch(() => commit('error', 'Could not get branches list'));
    return promise;
  },

  startBuild({ commit }, payload) {
    const promise = api.post('extranet/build', payload);
    promise.catch(error => commit('error', error));
    return promise;
  },

  removeBuild({ commit }, id) {
    const promise = api.delete(`extranet/build/${id}`);
    promise.catch(error => commit('error', error));
    return promise;
  },

  getConfigurations({ commit }) {
    const promise = api.get('extranet/configurations');

    promise
      .then(response => commit('configurations', response.data.data))
      .catch(() => commit('error', 'Could not get configurations list'));
    return promise;
  },

  createConfiguration({ commit }, payload) {
    const promise = api.post('extranet/configurations', payload);

    promise
      .then(response => commit('createConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not create configuration', { root: true }));

    return promise;
  },

  updateConfiguration({ commit }, payload) {
    const promise = api.put(`extranet/configurations/${payload.id}`, payload);

    promise
      .then(response => commit('updateConfiguration', response.data.data))
      .catch(() => commit('error', 'Could not update configuration', { root: true }));

    return promise;
  },

  deleteConfiguration({ commit }, id) {
    const promise = api.delete(`extranet/configurations/${id}`);

    promise
      .then(() => commit('deleteConfiguration', id))
      .catch(() => commit('error', 'Could not delete configuration', { root: true }));

    return promise;
  },
};
