import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getBuilds({ commit }, { stateName }) {
    const promise = api.get('builds');
    promise
      .then((response) => {
        commit('builds', { name: stateName, data: response.data.data });
      })
      .catch(() => commit('error', 'Could not get builds list'));
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
        commit('builds', { name: stateName, data: response.data.data });
      })
      .catch(() => commit('error', 'Could not get builds list'));

    return promise;
  },
};
