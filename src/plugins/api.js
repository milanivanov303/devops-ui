import Axios from 'axios';
import queryString from 'query-string';
import store from '../store';

const axios = Axios.create();

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(`token.${axios.prototype.code}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    return store.dispatch('getToken', axios.prototype.code)
      .then((token) => {
        localStorage.setItem(`token.${axios.prototype.code}`, token);
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
  }

  get(uri, options) {
    axios.prototype.code = this.code;
    const query = queryString.stringify(options, { arrayFormat: 'index' });
    return axios.get(`${this.url}/${uri}?${query}`);
  }

  put(uri, data) {
    axios.prototype.code = this.code;
    return axios.put(`${this.url}/${uri}`, data);
  }

  post(uri, data) {
    axios.prototype.code = this.code;
    return axios.post(`${this.url}/${uri}`, data);
  }
}

export default Api;
