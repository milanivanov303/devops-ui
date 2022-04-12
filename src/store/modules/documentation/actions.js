import Axios from 'axios';
import config from '@/config';

const gitlab = Axios.create({
  baseURL: config.gitlab.url,
});

export default {
  getFiles({ commit }) {
    const promise = gitlab.get('api/v4/projects/495/repository/tree?path=API Catalog/Extranet&recursive=1&per_page=100');

    promise
      .catch(() => commit('error', 'Could not get documentation list', { root: true }));
    return promise;
  },

  getRawFile({ commit }, file) {
    const promise = gitlab.get(`api/v4/projects/495/repository/blobs/${file.id}/raw`);

    promise
      .catch(() => commit('error', 'Could not get raw file', { root: true }));
    return promise;
  },

  getSpecs({ commit }, { branch, repo }) {
    const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}`);

    promise
      .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    return promise;
  },

  getDetails({ commit }, { branch, repo }) {
    const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}&file=data.json`);

    promise
      .catch(() => commit('error', 'Could not get documentation details', { root: true }));
    return promise;
  },

  getRamlFile({ commit }, { branch, repo, file }) {
    const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}&file=${file}`);

    promise
      .catch(() => commit('error', 'Could not get RAML file', { root: true }));
    return promise;
  },
};
