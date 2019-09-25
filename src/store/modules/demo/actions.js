// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  async submitDemo({ commit }, payload) {
    try {
      let response = '';
      if (payload.action === 'update') {
        response = await api.put(`demos/${payload.demoId}`, payload.formData);
        commit('updateDemos', response.data.data);
      }
      if (payload.action === 'add_new') {
        response = await api.post('demos', payload.formData);
        commit('addDemo', response.data.data);
      }
    } catch (error) {
      commit('error', error);
    }
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
