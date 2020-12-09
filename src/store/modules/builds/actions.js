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

  updateBuild({ commit }, id) {
    const promise = api('devops').get('builds', {
      fields: JSON.stringify([
        'module',
        'created_by',
        'details',
      ]),
      filters: JSON.stringify({
        allOf: [
          {
            id,
          },
        ],
      }),
    });

    promise
      .then(response => commit('updateBuild', response.data.data))
      .catch(() => commit('error', 'Could not update build', { root: true }));

    return promise;
  },
  start({ dispatch, commit }, id) {
    const promise1 = api('devops').post(`builds/${id}/start`);
    const promise2 = dispatch('updateBuild', id);

    return Promise.all([promise1, promise2])
      .then(() => commit('start', id))
      .catch(() => commit('error', 'Could not start build', { root: true }));
  },

  stop({ commit }, id) {
    const promise = api('devops').post(`builds/${id}/stop`);

    promise
      .then(() => commit('stop', id))
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
    branch, module, status, user, perPage, page,
  }) {
    const promise = api('devops').get('builds', {

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
            created_by: user,
          },
        ],
      }),
      orders: JSON.stringify({
        created_on: 'desc',
      }),
      per_page: perPage,
      page,
    });

    promise
      .catch(() => commit('error', 'Could not get builds list', { root: true }));

    return promise;
  },
};
