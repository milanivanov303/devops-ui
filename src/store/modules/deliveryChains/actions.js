// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.mmpi.url, config.mmpi.code);

export default {
  async getDeliveryChains({ commit }, payload) {
    try {
      const resp = await api.get('delivery-chains', payload);
      commit('deliveryChains', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
};
