import Axios from 'axios';
import queryString from 'query-string';
import store from '../store';

const axios = Axios.create();

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(`token.${axios.prototype.code}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    return store.dispatch('getToken', axios.prototype.code)
      .then((token) => {
        sessionStorage.setItem(`token.${axios.prototype.code}`, token);
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios.request(error.config);
      });
  }
  return Promise.reject(error);
});

class Api {
  constructor(url, code) {
    this.url = url;
    this.code = code;
    axios.prototype.code = code;
  }

  async get(uri, options) {
    try {
      const query = queryString.stringify(options, { arrayFormat: 'index' });
      const response = await axios.get(`${this.url}/${uri}?${query}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async post(uri, data) {
    try {
      const response = await axios.post(`${this.url}/${uri}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default Api;
