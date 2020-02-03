// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  async createDemo({ commit }, payload) {
    try {
      let response = '';
      // if (payload.action === 'update') {
      //   response = await api.put(`demos/${payload.demoId}`, payload.formData);
      //   commit('updateDemos', response.data.data);
      // }
      if (payload.action === 'create') {
        response = await api.post('demos', payload.formData);
        commit('createDemo', response.data.data);
      }
    } catch (error) {
      commit('error', error);
    }
  },
  updateDemo({ commit }, { id, payload }) {
    const promise = api.put(`demos/${id}`, payload);
    promise
      .then(response => commit('updateDemo', response.data.data))
      .catch(error => commit('error', error));
    return promise;
  },
  deleteDemo({ commit }, id) {
    const promise = api.delete(`demos/${id}`);
    promise
      .then(() => commit('deleteDemo', id))
      .catch(error => commit('error', error));
    return promise;
  },
  async getDemos({ commit }, payload) {
    try {
      const response = await api.get('demos', payload);
      commit('fillDemos', response.data.data);
    } catch (error) {
      commit('error', error);
    }
  },
};
