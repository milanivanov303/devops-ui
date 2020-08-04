import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getActive({ commit }) {
    const promise = api.get('builds', {
      filters: JSON.stringify({
        anyOf: [
          {
            status: 'running',
          },
          {
            status: 'stopped',
          },
        ],
      }),
    });

    promise
      .then((response) => {
        commit('active', response.data.data);
      })
      .catch(() => commit('error', 'Could not get builds list', { root: true }));
    return promise;
  },

  getBuildsForPeriod({ commit }, { startDate, stateName }) {
    const promise = api.get('builds', {
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
    });

    promise
      .then((response) => {
        commit('statistics', { name: stateName, data: response.data.data });
      })
      .catch(() => commit('error', 'Could not get builds list', { root: true }));

    return promise;
  },

  getBuildByName({ commit }, { name }) {
    const promise = api.get('builds', {
      filters: JSON.stringify({
        allOf: [
          {
            'details->service->Spec->Name': name,
          },
        ],
      }),
    });

    promise
      .catch(() => commit('error', 'Could not get build by name', { root: true }));

    return promise;
  },

  start({ commit }, id) {
    const promise = api.post(`builds/${id}/start`);

    promise
      .then(() => commit('markAsRunning', id))
      .catch(() => commit('error', 'Could not start build', { root: true }));

    return promise;
  },

  stop({ commit }, id) {
    const promise = api.post(`builds/${id}/stop`);

    promise
      .then(() => commit('markAsStopped', id))
      .catch(() => commit('error', 'Could not stop build', { root: true }));

    return promise;
  },
};
