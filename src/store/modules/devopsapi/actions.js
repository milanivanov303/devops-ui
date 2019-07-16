// https://vuex.vuejs.org/en/actions.html
import queryString from 'query-string';
import axios from '../../../plugins/api';
import config from '../../../config';

export default {
  get({ commit }, uri, options) {
    return new Promise((resolve, reject) => {
      const query = queryString.stringify(options, { arrayFormat: 'index' });
      axios.get(`${config.devops.url}/${uri}?${query}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          commit('error', err);
          reject(err);
        });
    });
  },
  post({ commit }, uri, data) {
    return new Promise((resolve, reject) => {
      axios.get(`${config.devops.url}/${uri}`, data)
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
