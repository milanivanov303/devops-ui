import axios from 'axios';
import queryString from 'query-string';
import auth from './auth';


const axiosApi = axios.create();

axiosApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(`token.${axiosApi.prototype.code}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosApi.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    return auth.getToken(axiosApi.prototype.code).then((token) => {
      sessionStorage.setItem(`token.${axiosApi.prototype.code}`, token);
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
    axiosApi.prototype.code = code;
  }

  async get(uri, options) {
    try {
      const query = queryString.stringify(options, { arrayFormat: 'index' });
      const response = await axiosApi.get(`${this.url}/${uri}?${query}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async post(uri, data) {
    try {
      const response = await axiosApi.post(`${this.url}/${uri}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default Api;
