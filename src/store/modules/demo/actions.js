// https://vuex.vuejs.org/en/actions.html
import { DateTime } from 'luxon';

export default {
  createDemo({ commit }, payload) {
    const promise = api('devops').post('demos', payload);
    promise
      .then((response) => commit('createDemo', response.data.data))
      .catch((error) => commit('error', error));

    return promise;
  },

  updateDemo({ commit }, payload) {
    const promise = api('devops').put(`demos/${payload.id}`, payload);
    promise
      .then((response) => commit('updateDemo', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },

  getDemos({ commit }) {
    const promise = api('devops').get('demos', {
      orders: JSON.stringify({ id: 'desc' }),
    });
    promise
      .then((response) => commit('fillDemos', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },

  getDemosForPeriod({ commit }, { stateName, startDate }) {
    const promise = api('devops').get('demos', {
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
      .then((response) => commit('demos', { name: stateName, data: response.data.data }))
      .catch(() => commit('error', 'Could not get demos list'));

    return promise;
  },

  /**
   * Send Request to API and get responce xlsx file
   */
  getDemosExport({ commit }) {
    const promise = api('devops').get(
      'demos/export',
      '',
      {
        responseType: 'blob',
      },
    );
    promise
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', `${DateTime.local().toFormat('dd_MM_y')}_demos.xlsx`);
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch((error) => commit('error', error));
    return promise;
  },
};
