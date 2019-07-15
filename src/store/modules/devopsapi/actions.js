// https://vuex.vuejs.org/en/actions.html
import queryString from 'query-string';
import axios from '../../../plugins/api';
import config from '../../../config';

export default {
  async get(uri, options) {
    try {
      const query = queryString.stringify(options, { arrayFormat: 'index' });
      const response = await axios.get(`${config.devops.url}/${uri}?${query}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async post(uri, data) {
    try {
      const response = await axios.post(`${config.devops.url}/${uri}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
