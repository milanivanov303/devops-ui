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

  findBuildByName({ commit }, name) {
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
      .catch(() => commit('error', 'Could not start build', { root: true }));

    return promise;
  },

  stop({ commit }, id) {
    const promise = api.post(`builds/${id}/stop`);

    promise
      .catch(() => commit('error', 'Could not stop build', { root: true }));

    return promise;
  },

  ping({ commit }, id) {
    const promise = api.get(`builds/${id}/ping`);

    promise
      .catch(() => commit('error', 'Could not ping build', { root: true }));

    return promise;
  },

  getBuildsByStatus({ commit }, {
    branch, module, status, user, perPage, page,
  }) {
    const promise = api.get('builds', {

      filters: JSON.stringify({
        allOf: [
          {
            status: {
              operator: 'in',
              value: status,
            },
          },
          {
            module,
          },
          {
            'details->branch': branch,
          },
          {
            'details->created_by': user,
          },
        ],
      }),
      orders: JSON.stringify({
        status: 'asc',
      }),
      per_page: perPage,
      page,
    });

    promise
      .catch(() => commit('error', 'Could not get builds list', { root: true }));

    return promise;
  },
};
