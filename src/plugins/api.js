import Axios from 'axios';
import store from '../store';
import config from '../config';

const axios = Axios.create();
axios.prototype.code = config.devops.code;

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(`token.${axios.prototype.code}`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axios.interceptors.response.use(null, async (error) => {
  if (error.response.status === 401) {
    debugger;
    const token = await store.dispatch('getToken', axios.prototype.code);
    error.config.headers.Authorization = `Bearer ${token}`;
    return axios.request(error.config);
  }

  return Promise.reject(error);
});
export default axios;
// class Api {
//   constructor(url, code) {
//     this.url = url;
//     this.code = code;
//     axiosApi.prototype.code = code;
//   }

//   async get(uri, options) {
//     try {
//       const query = queryString.stringify(options, { arrayFormat: 'index' });
//       const response = await axiosApi.get(`${this.url}/${uri}?${query}`);
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
//   }

//   async post(uri, data) {
//     try {
//       const response = await axiosApi.post(`${this.url}/${uri}`, data);
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return error;
//     }
//   }
// }

// export default Api;
