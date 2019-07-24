// import Vue from 'vue';
// import Axios from 'axios';
// import store from '../store';
// import router from '../router';

// const axios = Axios.create();

// axios.interceptors.request.use((config) => {
//   config.withCredentials = true;

//   const token = sessionStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default axios;
/*
const authStore = {
  state: {
    loggingIn: false,
    loggingInSSO: false,
    hasError: false,
    error: '',
    user,
  },
  getters: {
    isLoggingIn(state) {
      return state.loggingIn;
    },
    isLoggingInSSO(state) {
      return state.loggingInSSO;
    },
    hasError(state) {
      return state.hasError;
    },
    getError(state) {
      return state.error;
    },
    user(state) {
      return state.user;
    },
  },
  mutations: {
    loggingIn(state, loggingIn) {
      state.loggingIn = loggingIn;
    },
    loggingInSSO(state, loggingInSSO) {
      state.loggingInSSO = loggingInSSO;
    },
    hasError(state, hasError) {
      state.hasError = hasError;
    },
    error(state, error) {
      state.error = error;
    },
  },
};

// store.registerModule('auth', authStore);

// const axiosAuth = axios.create();

// axiosAuth.interceptors.request.use((config) => {
//   config.withCredentials = true;

//   const token = sessionStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

class Auth {
  static install(Vue) {
    const auth = {};
    const ssoLogin = localStorage.getItem('sso-login') || 'true';
    if (!auth.user() && ssoLogin === 'true') {
      auth.loginSSO();
    }

    Vue.auth = auth;
    Object.defineProperties(Vue.prototype, {
      auth: {
        get() {
          return auth;
        },
      },
      $auth: {
        get() {
          return auth;
        },
      },
    });
  }

  static getParam(name) {
    const url = new URL(window.location.toString());
    return url.searchParams.get(name);
  }

  getReturnUri() {
    const returnUri = this.getParam('return_uri');
    if (returnUri) {
      return returnUri;
    }

    if (window.location.pathname !== '/login') {
      return window.location.pathname + window.location.search;
    }

    return '/';
  }

  getSsoUrl() {
    let redirectUrl = `${window.location.origin}/login`;

    const returnUri = this.getReturnUri();
    if (returnUri) {
      redirectUrl += `?return_uri=${returnUri}`;
    }

    return `${config['user-management'].url}/login?redirect_url=${redirectUrl}`;
  }

  async login(username, password) {
    store.commit('loggingIn', true);
    store.commit('hasError', false);

    try {
      const response = await axiosAuth.post(
        `${config['user-management'].url}/v1/auth/login`,
        { username, password },
      );

      sessionStorage.setItem('user', JSON.stringify(response.data));

      router.push(this.getReturnUri());
    } catch (error) {
      store.commit('hasError', true);
      store.commit('error', 'Incorrect username or password');
    }

    store.commit('loggingIn', false);
  }

  async loginSSO() {
    store.commit('loggingInSSO', true);
    store.commit('hasError', false);

    localStorage.setItem('sso-login', 'true');

    const token = this.getParam('token');
    if (token) {
      sessionStorage.setItem('token', token);
    }

    if (!token) {
      window.location.href = this.getSsoUrl();
    }

    try {
      const response = await axiosAuth.get(
        `${config['user-management'].url}/v1/auth/identity`,
      );

      sessionStorage.setItem('user', JSON.stringify(response.data));

      router.push(this.getReturnUri());
    } catch (error) {
      store.commit('hasError', true);
      store.commit(
        'error',
        'Could not login with SSO. Please try again later or use the login form',
      );
    }

    return store.commit('loggingInSSO', false);
  }

  static logout() {
    localStorage.setItem('sso-login', 'false');
    sessionStorage.clear();

    router.push('/login');
  }

  static user() {
    const user = sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  static async getToken(code) {
    try {
      const response = await axiosAuth.get(
        `${config['user-management'].url}/v1/auth/token`,
        {
          params: {
            code,
          },
        },
      );

      return response.data.token;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

const auth = new Auth();

Vue.use(auth);

export default auth;
*/
