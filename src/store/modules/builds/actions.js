let cancelToken;

export default {

  getActive({ commit }) {
    const promise = api('devops').get('builds', {
      fields: JSON.stringify([
        'id',
        'name',
        'module',
        'status',
        'created_on',
        'created_by',
        'details',
      ]),
      filters: JSON.stringify({
        anyOf: [
          {
            status: {
              operator: 'in',
              value: ['running', 'stopped', 'building'],
            },
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
    const promise = api('devops').get('builds', {
      fields: JSON.stringify([
        'module',
        'created_by',
        'details',
      ]),
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

  start({ commit }, id) {
    const promise = api('devops').post(`builds/${id}/start`);

    promise
      .then(response => commit('update', response.data.data))
      .catch(() => commit('error', 'Could not start build', { root: true }));

    return promise;
  },

  stop({ commit }, id) {
    const promise = api('devops').post(`builds/${id}/stop`);

    promise
      .then(response => commit('update', response.data.data))
      .catch(() => commit('error', 'Could not stop build', { root: true }));

    return promise;
  },

  ping({ commit }, id) {
    const promise = api('devops').get(`builds/${id}/ping`);

    promise
      .catch(() => commit('error', 'Could not ping build', { root: true }));

    return promise;
  },

  getBuildsByStatus({ commit }, {
    branch, module, status, user, perPage, page, search,
  }) {
    const devopsApi = api('devops');

    if (typeof cancelToken !== 'undefined') {
      cancelToken.cancel();
    }

    cancelToken = devopsApi.axios.CancelToken.source();

    const promise = devopsApi.get('builds', {
      filters: JSON.stringify({
        allOf: [
          {
            status: {
              operator: 'in',
              value: status,
            },
          },
          {
            name: {
              operator: 'like',
              value: ''.concat('%', search, '%'),
            },
          },
          {
            module,
          },
          {
            'details->branch': branch,
          },
          {
            created_by: user,
          },
        ],
      }),
      orders: JSON.stringify({
        created_on: 'desc',
      }),
      per_page: perPage,
      page,
    }, {
      cancelToken: cancelToken.token,
    });

    promise
      .catch(() => commit('error', 'Could not get builds list', { root: true }));

    return promise;
  },
};
