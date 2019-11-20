import Axios from 'axios';
import queryString from 'query-string';
import store from '../store';

class Api {
  constructor(url, code) {
    this.url = url;
    this.code = code;

    this.axios = Axios.create();

    this.axios.interceptors.request.use(this.requestInterceptor.bind(this));
    this.axios.interceptors.response.use(null, this.errorInterceptor.bind(this));
  }

  requestInterceptor(config) {
    const token = localStorage.getItem(`token.${this.code}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  errorInterceptor(error) {
    if (error.response.status === 401) {
      return store.dispatch('getToken', this.code)
        .then((token) => {
          localStorage.setItem(`token.${this.code}`, token);
          error.config.headers.Authorization = `Bearer ${token}`;
          return Axios.create().request(error.config);
        });
    }
    return Promise.reject(error);
  }

  get(uri, options) {
    const query = queryString.stringify(options, { arrayFormat: 'index' });
    return this.axios.get(`${this.url}/${uri}?${query}`);
  }

  put(uri, data) {
    return this.axios.put(`${this.url}/${uri}`, data);
  }

  post(uri, data) {
    return this.axios.post(`${this.url}/${uri}`, data);
  }

  delete(uri) {
    return this.axios.delete(`${this.url}/${uri}`);
  }
}

export default Api;
