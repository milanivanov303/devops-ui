import Axios from 'axios';
import queryString from 'query-string';
import auth from '@/plugins/auth';

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
      return auth.getApiToken(this.code).then(response => {
          localStorage.setItem(`token.${this.code}`, response.data.token);
          error.config.headers.Authorization = `Bearer ${response.data.token}`;
          return Axios.create().request(error.config);
      });
    }
    return Promise.reject(error);
  }

  get(uri, options = {}, config = {}) {
    let query = queryString.stringify(options, { arrayFormat: 'index' });
    if (query) {
      query = `?${query}`;
    }
    return this.axios.get(`${this.url}/${uri}${query}`, config);
  }

  put(uri, data, config = {}) {
    return this.axios.put(`${this.url}/${uri}`, data, config);
  }

  post(uri, data, config = {}) {
    return this.axios.post(`${this.url}/${uri}`, data, config);
  }

  delete(uri, config = {}) {
    return this.axios.delete(`${this.url}/${uri}`, config);
  }
}

export default Api;
