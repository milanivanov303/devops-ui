import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getBuilds({ commit }) {
    const name = 'builds_builds';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('builds');

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => {
        commit('builds', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get builds list'));

    return promise;
  },

  getBuildsForPeriod({ commit }, { startDate, stateName }) {
    const payload = {
      filters: JSON.stringify({
        allOf: [
          {
            created_on: {
              operator: '>',
              value: startDate,
            },
          },
        ],
      }),
    };

    const promise = api.get('builds', payload);

    promise
      .then((response) => {
        commit(stateName, response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get builds list'));

    return promise;
  },

};
