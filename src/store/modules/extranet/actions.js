// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getClients({ commit }) {
    const name = 'extranet_clients';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/clients');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('clients', response.data))
      .catch(() => commit('error', 'Could not get clients list'));

    return promise;
  },

  getBranches({ commit }) {
    const name = 'extranet_branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list'));

    return promise;
  },

  getContainers({ commit }) {
    const name = 'extranet_containers';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/containers');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => {
        commit('containers', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get containers list'));

    return promise;
  },
  
  getFebranches({ commit }) {
    const name = 'extranet_fe-branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('extranet/fe-branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('fe_branches', response.data))
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
};
