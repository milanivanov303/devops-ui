// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  async submitRequest({ commit }, payload) {
    try {
      await api.post('demos', payload);
    } catch (error) {
      commit('error', error);
    }
  },
  async getDemos({ commit, state }, payload) {
    if (state.demos.length) {
      return;
    }
    try {
      const response = await api.get('demos', payload);
      commit('fillDemos', response.data.data);
    } catch (error) {
      commit('error', error);
    }
  },
};
