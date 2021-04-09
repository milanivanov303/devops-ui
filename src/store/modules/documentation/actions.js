export default {
  getApiDocumentation({ commit }, { branch, repo }) {
    const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}`);

    promise
      .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    return promise;
  },
  getDocDetails({ commit }, { branch, repo }) {
    const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}&file=data.json`);

    promise
      .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    return promise;
  },

  getRamlFile({ commit }, { branch, repo, file }) {
    const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}&file=${file}`);

    promise
      .catch(() => commit('error', 'Could not get RAML file', { root: true }));
    return promise;
  },
};
