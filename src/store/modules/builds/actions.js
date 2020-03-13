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

  getModuleBuildsForPeriod({ commit }, { startDateModule }) {
    const name = 'period_moduleBuilds';

    const payload = {
      filters: JSON.stringify({
        allOf: [
          {
            created_on: {
              operator: '>',
              value: startDateModule,
            },
          },
        ],
      }),
    };

    const promise = api.get('builds', payload);

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => {
        commit('moduleBuilds', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get builds list'));

    return promise;
  },

  getUsersBuildsForPeriod({ commit }, { startDateUsers }) {
    const name = 'period_usersBuilds';

    const payload = {
      filters: JSON.stringify({
        allOf: [
          {
            created_on: {
              operator: '>',
              value: startDateUsers,
            },
          },
        ],
      }),
    };

    const promise = api.get('builds', payload);

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => {
        commit('usersBuilds', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get builds list'));

    return promise;
  },

  getBranchBuildsForPeriod({ commit }, { startDateBranch }) {
    const name = 'period_branchBuilds';

    const payload = {
      filters: JSON.stringify({
        allOf: [
          {
            created_on: {
              operator: '>',
              value: startDateBranch,
            },
          },
        ],
      }),
    };

    const promise = api.get('builds', payload);

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => {
        commit('branchBuilds', response.data.data);
        commit('host', response.data.meta.host);
      })
      .catch(() => commit('error', 'Could not get builds list'));

    return promise;
  },

};
