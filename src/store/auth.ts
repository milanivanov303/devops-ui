import router from "@/router";
declare var axios: any;
declare var config: any;

let user = localStorage.getItem("user");
if (user) {
  user = JSON.parse(user);
}

export default {
  state: {
    user,
    loggingIn: false,
    loggingInSSO: false,
    hasError: false,
    error: ""
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.user !== null;
    },
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
    loggedIn(state, user) {
      state.user = user;
    },
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
    logout(state) {
      state.user = null;
    }
  },
  actions: {
    async login({ dispatch, commit }, {username, password, returnUri = "/"}) {
      commit("loggingIn", true);
      commit("hasError", false);

      try {
        const response = await axios.post(`${config["user-management"].url}/v1/auth/login`,
          {
            username,
            password
          },
          {
            withCredentials: true
          }
        );

        localStorage.setItem("user", JSON.stringify(response.data));
        commit("loggedIn", response.data);

        router.push(returnUri);
      } catch (error) {
        commit("hasError", true);
        commit("error", "Incorrect username or password");
      }

      commit("loggingIn", false);
    },
    async loginSSO({ dispatch, commit}, {token, returnUri = "/"}) {
      commit("loggingInSSO", true);
      commit("hasError", false);

      try {
        const response = await axios.get(`${config["user-management"].url}/v1/auth/identity`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        localStorage.setItem("user", JSON.stringify(response.data));
        commit("loggedIn", response.data);

        router.push(returnUri);
      } catch (error) {
        commit("hasError", true);
        commit("error", "Could not login with SSO. Please try again later or use the login form");
      }

      commit("loggingInSSO", false);
    },
    logout({ commit }) {
      localStorage.removeItem("user");
      commit("logout");

      router.push("/login");
    }
  }
};
