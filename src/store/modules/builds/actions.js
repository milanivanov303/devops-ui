import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  getActive({ commit }) {
    const promise = api.get('builds', {
      filters: JSON.stringify({
        allOf: [
          {
            status: 'running',
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
  getBuildsByStatus({ commit }, {
    branch, module, status, user,
  }) {
    
    // if (this.state.builds.builds[status]) {
    //   return Object.values(this.state.builds.builds[status]).filter((build) => {
    //     if(module) {
    //       return build.module === module;
    //     };
    //     if (branch) {
    //       return build.details.branch === branch;
    //     };
    //     if (user) {
    //       return build.details.created_by === user;
    //     };
    //   });
    // }

    const promise = api.get('builds', {
      filters: JSON.stringify({
        allOf: [
          {
            status,
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
    });

    promise
      .then((response) => {
        commit('builds', { status, builds: response.data.data });
      })
      .catch(() => commit('error', 'Could not get builds list', { root: true }));

    return promise;
  },
};
