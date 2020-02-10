// https://vuex.vuejs.org/en/actions.html
import Api from "../plugins/api";
import config from "../config";

const api = new Api(config.devops.url, config.devops.code);

export default {
  getBuilds({ commit }) {
    const promise = api.get('builds');
    //promise
    //  .then(response => commit('addRole', response.data.data))
    //  .catch(error => commit('error', error));
    return promise;
  },
};
