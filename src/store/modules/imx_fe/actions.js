// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getBranches({ commit }) {
    const name = 'imx_fe_branches';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('imx-fe/branches');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('branches', response.data))
      .catch(() => commit('error', 'Could not get branches list'));

    return promise;
  },
  getContainers({ commit }) {
    const promise = api.get('imx-fe/containers');
    
    promise
      .then((response) => {
        commit('containers', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get containers list'));

    return promise;
  },
  startBuild({ commit }, payload) {
    const promise = api.post('imx-fe/build', payload);
    promise.catch(error => commit('error', error));
    return promise;
  },
  removeBuild({ commit }, id) {
    const promise = api.delete(`imx-fe/build/${id}`);
    promise
      .then(() => commit('removeBuild', id))
      .catch(error => commit('error', error, { root: true }));
    return promise;
  },
};
