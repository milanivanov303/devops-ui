// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.devops.url, config.devops.code);

export default {
  createDemo({ commit }, payload) {
    const promise = api.post('demos', payload);
    promise
      .then(response => commit('createDemo', response.data.data))
      .catch(error => commit('error', error));

    return promise;
  },

  updateDemo({ commit }, payload) {
    const promise = api.put(`demos/${payload.id}`, payload);
    promise
      .then(response => commit('updateDemo', response.data.data))
      .catch(error => commit('error', error));
    return promise;
  },

  getDemos({ commit }) {
    const promise = api.get('demos', {
      orders: JSON.stringify({ id: 'desc' }),
    });
    promise
      .then(response => commit('fillDemos', response.data.data))
      .catch(error => commit('error', error));
    return promise;
  },

  getDemosForPeriod({ commit }, { stateName, startDate }) {
    const promise = api.get('demos', {
      filters: JSON.stringify({
        allOf: [
          {
            active_from: {
              operator: '>',
              value: startDate,
            },
          },
        ],
      }),
    });

    promise
      .then(response => commit('demos', { name: stateName, data: response.data.data }))
      .catch(() => commit('error', 'Could not get demos list'));

    return promise;
  },

  getDemosExport({ commit }) {
    const promise = api.get('demos/export');
    promise
    .then((response) => {
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement('a');
 
      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'demos.xlsx');
      document.body.appendChild(fileLink);
 
      fileLink.click();
    })
    .catch(error => commit('error', error));
    return promise;
  },
};
