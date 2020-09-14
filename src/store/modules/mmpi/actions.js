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
      .then(response => commit('instances', response.data.data))
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
      .then(response => commit('deployInstances', response.data.data))
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
        ],
      }),
      with: JSON.stringify({ delivery_chains: { instances: ['environment_type'] } }),
      orders: JSON.stringify({
        name: 'asc',
      }),
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('projects', response.data.data))
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
      .then(response => commit('deliveryChains', response.data.data))
      .catch(() => commit('error', 'Could not get delivery chains list', { root: true }));

    return promise;
  },
};
