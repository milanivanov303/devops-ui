import { DateTime } from 'luxon';

export default {
  getSpecs({ commit }, payload) {
    const promise = api('devops').get('specs', payload);

    promise
      .then((response) => commit('specs', response.data))
      .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    return promise;
  },

  getDetails({ commit }, payload) {
    payload.file = 'data.json';
    const promise = api('devops').get('specs', payload);

    promise
      .catch(() => commit('error', 'Could not get documentation details', { root: true }));
    return promise;
  },

  download({ commit }, parameters) {
    const promise = api('devops').post(
      'specs/download',
      parameters,
      {
        responseType: 'blob',
      },
    );
    promise
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute(
          'download',
          response.headers['content-disposition'].split('filename=')[1],
        );
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    return promise;
  },
  export({ commit }, payload) {
    const promise = api('devops').post('specs/export',
      payload,
      { responseType: 'blob' });
    promise
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', `${DateTime.local().toFormat('dd_MM_y')}_${payload.apis_dir}_documentation.xlsx`);
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch((error) => commit('error', error));
    return promise;
  },
};
