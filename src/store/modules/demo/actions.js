// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  async createDemo({ commit }, payload) {
    try {
      let response = '';
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
  async getDemos({ commit }, payload) {
    try {
      const response = await api.get('demos', payload);
      commit('fillDemos', response.data.data);
    } catch (error) {
      commit('error', error);
    }
  },

  getDemosForPeriod({ commit }, { stateName, startDate }) {
    const promise = api.get('demos', {
      filters: JSON.stringify({
        allOf: [
          {
            active_from: {
              operator: '>',
              value: startDate,
            },
          },
        ],
      }),
    });

    promise
      .then((response) => commit('demos',  { name: stateName, data: response.data.data } ))
      .catch(() => commit('error', 'Could not get demos list'));

    return promise;
  },
};
