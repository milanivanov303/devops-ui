// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.mmpi.url, config.mmpi.code);

export default {
  getInstances({ commit }) {
    const name = 'instances';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('instances', {
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

    const promise = api.get('instances', {
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

    const promise = api.get('projects', {
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

    const promise = api.get('delivery-chains', {
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

  /**
   * Get delivery chains for CMS tab
   */
  async getDeliveryChainsCMS({ commit }, payload) {
    try {
      const resp = await api.get('delivery-chains', payload);
      commit('deliveryChains', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },

  /**
   * Get projects chains for CMS tab
   */
  async getProjectsCMS({ commit, state }, payload) {
    if (state.projects.length) {
      return;
    }
    try {
      const resp = await api.get('projects', payload);
      commit('projects', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },

  async addRolesTmp({ commit }, payload) {
    try {
      const resp = await api.put(`projects/roles-tmp/${payload.id}`, payload.data);
      commit('updateProject', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },

  async addRoles({ commit }, payload) {
    try {
      const resp = await api.put(`projects/roles/${payload.id}`, payload.data);
      commit('updateProject', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },

  /**
   * Get Instances for CMS tab
   */
  async getInstancesCMS({ commit, state }, payload) {
    if (state.instances.length) {
      return;
    }
    try {
      const response = await api.get('instances', payload);
      commit('instances', response.data.data);
    } catch (error) {
      commit('error', error);
    }
  },
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

    const promise = api.get('instances', payload);

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
};
