import Axios from 'axios';
import config from '@/config';

const gitlab = Axios.create({
  baseURL: config.gitlab.url,
});

export default {
  getSpecs({ commit }) { //, { branch, repo }) {

    return gitlab.get('api/v4/projects/495/repository/tree?path=API Catalog/Extranet&recursive=1&per_page=10000');

    // const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}`);
    //
    // promise
    //   .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    // return promise;
  },

  getRawFile({ commit }, file) {
    return gitlab.get(`api/v4/projects/495/repository/blobs/${file.id}/raw`);

    // const promise = api('devops').get(`specs/?repo=${repo}&branch=${branch}`);
    //
    // promise
    //   .catch(() => commit('error', 'Could not get apiDocumentationList', { root: true }));
    // return promise;
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
