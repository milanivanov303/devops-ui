// https://vuex.vuejs.org/en/actions.html
import queryString from 'query-string';
import axios from '../../../plugins/api';
import config from '../../../config';

export default {
  get({ commit }, payload) {
    return new Promise((resolve, reject) => {
      const query = queryString.stringify(payload.options, { arrayFormat: 'index' });
      axios.get(`${config.devops.url}/${payload.uri}?${query}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          commit('error', err);
          reject(err);
        });
    });
  },
  post({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${config.devops.url}/${payload.uri}`, payload.data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          commit('error', err);
          reject(err);
        });
    });
  },
};
