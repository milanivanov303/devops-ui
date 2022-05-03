export default {
  getSpecs({ commit }, parameters) {
    const promise = api('devops').get('specs', parameters);

    promise
      .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    return promise;
  },

  getDetails({ commit }, parameters) {
    parameters.file = 'data.json';
    const promise = api('devops').get('specs', parameters);

    promise
      .catch(() => commit('error', 'Could not get documentation details', { root: true }));
    return promise;
  },

  getRamlFile({ commit }, parameters) {
    const promise = api('devops').get('specs', parameters);

    promise
      .catch(() => commit('error', 'Could not get RAML file', { root: true }));
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
};
