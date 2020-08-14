// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.mmpi.url, config.mmpi.code);

export default {
  async getInstances({ commit, state }, payload) {
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
