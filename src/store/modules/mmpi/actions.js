// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.mmpi.url, config.mmpi.code);

export default {
  async getInstances({ commit }, payload) {
    try {
      const response = await api.get('instances', payload);
      commit('instances', response.data.data);
    } catch (err) {
      return commit('error', err);
    }
  },
};
