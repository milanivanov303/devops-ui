import axios from "axios";
import auth from "@/plugins/auth";

declare var config: object;

const _axios = axios.create();

_axios.interceptors.request.use(config => {
  let token = sessionStorage.getItem(`token.${_axios.prototype.code}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

_axios.interceptors.response.use(null, error => {
  if (error.response.status === 401) {
    return auth.getToken(_axios.prototype.code).then(token => {
      sessionStorage.setItem(`token.${_axios.prototype.code}`, token);

      error.config.headers.Authorization = `Bearer ${token}`;
      return axios.request(error.config);
    });
  }

  return Promise.reject(error);
});

class Api {
  private url: string;
  private code: string;

  constructor(url, code) {
    this.url = url;
    this.code = code;
    _axios.prototype.code = code;
  }

  async get(uri) {
    try {
      const response = await _axios.get(`${this.url}/${uri}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async post(uri, data) {
    try {
      const response = await _axios.post(`${this.url}/${uri}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Api;
