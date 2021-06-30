// https://vuex.vuejs.org/en/actions.html

export default {
  getInstances({ commit }) {
    const name = 'instances';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('mmpi').get('instances', {
      filters: JSON.stringify({
        allOf: [
          {
            environment_type: {
              allOf: [{ type: 'IMX' }],
            },
          },
          {
            instance_type_id: {
              value: ['DEV', 'VAL'],
              operator: 'in',
            },
          },
          {
            owner: {
              allOf: [{ key: 'codix' }],
            },
          },
          {
            status: {
              allOf: [{ key: 'active' }],
            },
          },
        ],
      }),
      orders: JSON.stringify({
        name: 'asc',
      }),
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('instances', response.data.data))
      .catch(() => commit('error', 'Could not get instances list', { root: true }));

    return promise;
  },

  getDeployInstances({ commit }) {
    const name = 'deploy_instances';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('mmpi').get('instances', {
      filters: JSON.stringify({
        allOf: [
          {
            environment_type: {
              allOf: [{ type: 'extranet' }],
            },
          },
          {
            owner: {
              allOf: [{ key: 'codix' }],
            },
          },
          {
            status: {
              allOf: [{ key: 'active' }],
            },
          },
        ],
      }),
      orders: JSON.stringify({
        name: 'asc',
      }),
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('deployInstances', response.data.data))
      .catch(() => commit('error', 'Could not get instances list', { root: true }));

    return promise;
  },

  getProjects({ commit }) {
    const name = 'projects';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('mmpi').get('projects', {
      filters: JSON.stringify({
        allOf: [
          {
            inactive: 0,
          },
          {
            delivery_chains: {
              allOf: [
                {
                  status: {
                    allOf: [
                      {
                        active: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      }),
      with: JSON.stringify({
        delivery_chains: {
          instances: ['environment_type'],
          status: [],
        },
      }),
      orders: JSON.stringify({
        name: 'asc',
      }),
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('projects', response.data.data))
      .catch(() => commit('error', 'Could not get projects list', { root: true }));

    return promise;
  },

  getDeliveryChains({ commit }) {
    const name = 'delivery-chains';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('mmpi').get('delivery-chains', {
      with: JSON.stringify(['instances']),
      orders: JSON.stringify({
        title: 'asc',
      }),
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('deliveryChains', response.data.data))
      .catch(() => commit('error', 'Could not get delivery chains list', { root: true }));

    return promise;
  },

  /**
   * Get Dev Instances for CMS tab
   */
  async getDevInstances({ commit }) {
    const name = 'devInstances';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const payload = {
      limit: 5000,
      orders: JSON.stringify({
        name: 'asc',
      }),
      filters: JSON.stringify({
        allOf: [
          {
            owner: {
              allOf: [
                {
                  key: 'codix',
                },
              ],
            },
          },
          {
            status: {
              allOf: [
                {
                  key: 'active',
                },
              ],
            },
          },
        ],
      }),
      fields: JSON.stringify({
        db_user: [],
        environment_type: [],
        host: [],
        id: [],
        instance_type_id: [],
        name: [],
        user: [],
        timezone: [],
        owner: [],
        status: [],
      }),
      with: JSON.stringify({
        environment_type: {},
        owner: {},
        status: {},
      }),
    };

    const promise = api('mmpi').get('instances', payload);

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => {
        const refbg2 = {
          name: 'refbg2',
          host: 'refbg2.codixfr.private',
        };
        response.data.data.unshift(refbg2);
        commit('devInstances', response.data.data);
      })
      .catch(() => commit('error', 'Could not get instances list'));

    return promise;
  },
  // Delivery Chanins for CMS Inventory page
  getDeliveryChainsCMS({ commit }) {
    const name = 'deliveryChainsCMS';
    const payload = {
      limit: 5000,
      orders: JSON.stringify({
        title: 'asc',
      }),
      filters: JSON.stringify({
        allOf: [
          {
            status: {
              allOf: [
                {
                  active: 1,
                },
              ],
            },
          },
        ],
      }),
      fields: JSON.stringify({
        id: [],
        title: [],
        type_id: [],
        patch_directory_name: [],
        dc_role: [],
        dc_version: [],
        dlvry_type: [],
        status: {
          id: [],
          active: [],
          key: [],
        },
        projects: {
          id: [],
          name: [],
        },
        instances: {
          id: [],
          environment_type_id: [],
          instance_type_id: [],
          name: [],
        },
        type: [],
      }),
      with: JSON.stringify({
        type: {},
        projects: {},
        instances: {},
        status: {},
      }),
    };

    const promise = api('mmpi').get('delivery-chains', payload);
    commit('promise', { name, promise }, { root: true });

    promise
      .then((resp) => {
        commit('deliveryChainsCMS', resp.data.data);
      })
      .catch(() => commit('error', 'Could not get delivery chains'));

    return promise;
  },

  getBinaryTypes({ commit }) {
    const name = 'binaryTypes';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('mmpi').get('enum-values', {
      fields: JSON.stringify({
        type: [],
        value: [],
      }),
      filters: JSON.stringify({
        allOf: [
          {
            type: {
              allOf: [
                'binary_types',
              ],
            },
            value: {
              allOf: [],
            },
          },
        ],
      }),
      with: JSON.stringify({
        type: [],
        value: [],
      }),
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then((response) => commit('binaryTypes', response.data.data))
      .catch(() => commit('error', 'Could not get binary types', { root: true }));

    return promise;
  },
};
