import Vue from "vue";
import axios from "axios";
import store from "@/store";
import router from "@/router";
import config from "@/config";

const authStore = {
  state: {
    loggingIn: false,
    loggingInSSO: false,
    hasError: false,
    error: ""
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
    }
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
    }
  }
};

store.registerModule("auth", authStore);

const _axios = axios.create();

_axios.interceptors.request.use(config => {
  config.withCredentials = true;

  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

class Auth {
  install(Vue) {
    const ssoLogin = localStorage.getItem("sso-login") || "true";
    if (!auth.user() && ssoLogin === "true") {
      auth.loginSSO();
    }

    Vue.auth = auth;
    Object.defineProperties(Vue.prototype, {
      auth: {
        get() {
          return auth;
        }
      },
      $auth: {
        get() {
          return auth;
        }
      }
    });
  }

  getParam(name) {
    const url = new URL(window.location.toString());
    return url.searchParams.get(name);
  }

  getReturnUri() {
    const returnUri = this.getParam("return_uri");
    if (returnUri) {
      return returnUri;
    }

    if (window.location.pathname !== "/login") {
      return window.location.pathname + window.location.search;
    }

    return "/";
  }

  getSsoUrl() {
    let redirectUrl = `${window.location.origin}/login`;

    const returnUri = this.getReturnUri();
    if (returnUri) {
      redirectUrl += `?return_uri=${returnUri}`;
    }

    return `${config["user-management"].url}/login?redirect_url=${redirectUrl}`;
  }

  async login(username, password) {
    store.commit("loggingIn", true);
    store.commit("hasError", false);

    try {
      const response = await _axios.post(
        `${config["user-management"].url}/v1/auth/login`,
        { username, password }
      );

      sessionStorage.setItem("user", JSON.stringify(response.data));

      router.push(this.getReturnUri());
    } catch (error) {
      store.commit("hasError", true);
      store.commit("error", "Incorrect username or password");
    }

    store.commit("loggingIn", false);
  }

  async loginSSO() {
    store.commit("loggingInSSO", true);
    store.commit("hasError", false);

    localStorage.setItem("sso-login", "true");

    const token = this.getParam("token");
    if (token) {
      sessionStorage.setItem("token", token);
    }

    if (!token) {
      return (window.location.href = this.getSsoUrl());
    }

    try {
      const response = await _axios.get(
        `${config["user-management"].url}/v1/auth/identity`
      );

      sessionStorage.setItem("user", JSON.stringify(response.data));

      router.push(this.getReturnUri());
    } catch (error) {
      store.commit("hasError", true);
      store.commit(
        "error",
        "Could not login with SSO. Please try again later or use the login form"
      );
    }

    store.commit("loggingInSSO", false);
  }

  logout() {
    localStorage.setItem("sso-login", "false");
    sessionStorage.clear();

    router.push("/login");
  }

  user() {
    const user = sessionStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  async getToken(code) {
    try {
      const response = await _axios.get(
        `${config["user-management"].url}/v1/auth/token`,
        {
          params: {
            code
          }
        }
      );

      return response.data.token;
    } catch (error) {
      console.log(error);
    }
  }
}

const auth = new Auth();

Vue.use(auth);

export default auth;
