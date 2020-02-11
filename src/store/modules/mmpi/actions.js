// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.mmpi.url, config.mmpi.code);

export default {
  getInstances({ commit, state }) {
    const name = 'instances';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('instances', {
      filters: JSON.stringify({
        allOf: [
          {
            environment_type: {
              allOf: [ { type: 'IMX' } ],
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
              allOf: [ { key: 'codix' } ],
            },
          },
        ],
      }),
      orders: JSON.stringify({
        name: 'asc',
      }),
    });

    commit('promise', { name, promise }, {root: true});

    promise
      .then((response) => commit('instances', response.data.data))
      .catch(() => commit('error', 'Could not get instances list'));

    return promise;
  },
};
