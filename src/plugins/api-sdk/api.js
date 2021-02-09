import Axios from 'axios';
import queryString from 'query-string';

class Api {
  constructor(auth, url, code) {
    this.auth = auth;
    this.code = code;

    this.axios = Axios.create({
      baseURL: url,
    });

    this.axios.CancelToken = Axios.CancelToken;
    this.axios.interceptors.request.use(this.requestInterceptor.bind(this));
    this.axios.interceptors.response.use(null, this.errorInterceptor.bind(this));
  }

  requestInterceptor(config) {
    this.auth.getApiToken(this.code).then((response) => {
      const token = response.data ? response.data.token : response;
      config.headers.Authorization = `Bearer ${token}`;
    });
    return config;
  }

  errorInterceptor(error) {
    if (error.response.status === 401) {
      return this.auth.getNewApiToken(this.code).then((response) => {
        error.config.headers.Authorization = `Bearer ${response.data.token}`;

        // remove baseUrl from url as i makes a problem when relative URLs are used
        error.config.url = error.config.url.replace(error.config.baseURL, '');

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
    return this.axios.get(`${uri}${query}`, config);
  }

  put(uri, data, config = {}) {
    return this.axios.put(`${uri}`, data, config);
  }

  post(uri, data, config = {}) {
    return this.axios.post(`${uri}`, data, config);
  }

  delete(uri, config = {}) {
    return this.axios.delete(`${uri}`, config);
  }
}

export default Api;
