// https://vuex.vuejs.org/en/actions.html
import Api from '../../../plugins/api';
import config from '../../../config';

const api = new Api(config.cms.url, config.cms.code);
const apiMMPI = new Api(config.mmpi.url, config.mmpi.code);

export default {
  getVariables({ commit }) {
    const name = 'config-defaults';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('default-variables', {
      limit: '1000000',
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('variables', response.data.data))
      .catch(() => commit('error', 'Could not get config-defaults list', { root: true }));
    return promise;

  },
  getImxModules({ commit }) {
    const name = 'imx-modules';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('modules', {
      with: JSON.stringify(['submodules']),
    });

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('modules', response.data.data))
      .catch(() => commit('error', 'Could not get IMX Modules', { root: true }));
    return promise;
  },
  getCodixTeams({ commit }) {
    const name = 'codix-teams';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api.get('codix-teams');

    commit('promise', { name, promise }, { root: true });

    promise
      .then(response => commit('codixTeams', response.data.data))
      .catch(() => commit('error', 'Could not get Codix Teams', { root: true }));
    return promise;
  },
  submitVariable({ commit }, payload) {

    var promise;

    if (payload.commitMsg) {
      promise = api.post(`default-variables/${payload.commitMsg.ttsKey}/` + 
                         `${payload.commitMsg.techChanges}/${payload.commitMsg.funcChanges}`,
                          payload.variable);

      promise
        .then(response => commit('createVariable', response.data.data))
        .catch(error => commit('error', error, { root: true }));
      return promise;   
    } 

    promise = api.put(`default-variables/${payload.variable.id}`, payload.variable);

    promise
      .then(response => commit('updateVariable', response.data.data))
      .catch(error => commit('error', error, { root: true }));
    return promise;
  
  },




  getTemplates({ commit }, payload) {
    const promise = api.get('cms/run-commands', payload);
    console.log("Get Templates");
    console.log(promise);
    promise
      .catch(error => commit('error', error));
    return promise;
  },
  async getRspVariables({ commit }, payload) {
    commit('rspVariables', '');
    if (payload) {
      try {
        const result = await api.get('response-variables', payload);
        commit('rspVariables', result.data.data);
      } catch (error) {
        console.log(error);
        commit('error', error);
      }
    }
  },
  getSelectedInstance({ commit }, payload) {
    commit('selectedInstance', payload);
  },
  getSelectedProject({ commit }, payload) {
    commit('selectedProject', payload);
  },
  getInstances({ commit }, payload) {
    let instances = '';
    if (payload) {
      // convert instances to indexed array
      instances = Object.keys(payload.instances)
        .map(item => payload.instances[item]);
    }
    commit('instances', instances);
  },
  getDeliveryChains({ commit }, payload) {
    // convert delivery chains to indexed array
    commit('deliveryChains', Object.keys(payload.delivery_chains)
      .map(item => payload.delivery_chains[item]));
  },
  getSelectedDeliveryChain({ commit }, payload) {
    commit('selectedDeliveryChain', payload);
  },
  async getUniqueInstancesId(payload) {
    const resp = await api.get('response-variables/unique-instances-id', payload);
    return resp.data.map(el => el.instance_id);
  },
  async getProjects({ commit, state, dispatch }) {
    if (!state.projects.length) {
      const payload = await dispatch('getUniqueInstancesId');
      try {
        // get specific instances->delivery_chains->projects by instance id
        // covnert it to projects->delivery_chains->instances
        const resp = await apiMMPI.get(`instances?with[delivery_chains][]=projects&projects&id=in ${payload.join(',')}`);
        const projects = [];
        resp.data.data.forEach((instance) => {
          instance.delivery_chains.forEach((deliveryChain) => {
            deliveryChain.projects.forEach((project) => {
              // set project.id as a key, because it is unique
              if (!projects[project.id]) {
                projects[project.id] = project;
                projects[project.id].delivery_chains = [];
              }
              // set deliveryChain.id as a key
              if (!projects[project.id].delivery_chains[deliveryChain.id]) {
                projects[project.id].delivery_chains[deliveryChain.id] = deliveryChain;
                projects[project.id].delivery_chains[deliveryChain.id].instances = [];
              }
              // set instance.id as a key
              if (!projects[project.id].delivery_chains[deliveryChain.id].instances[instance.id]) {
                projects[project.id]
                  .delivery_chains[deliveryChain.id]
                  .instances[instance.id] = instance;
              }
            });
          });
        });

        // convert projects to indexed array
        commit('projects', Object.keys(projects)
          .map(item => projects[item])
          .sort((a, b) => a.name.localeCompare(b.name)));

        await apiMMPI.get(`instances?with[delivery_chains][]=projects&projects&id=in ${payload.join(',')}`);
      } catch (error) {
        console.log(error);
        commit('error', error);
      }
    }
  },
  async getTemplatesMMPI({ commit }, payload) {
    try {
      const resp = await apiMMPI.get('sources', payload);
      // cannot access url if template name contains %
      const result = resp.data.data.reduce((acc, source) => {
        if (source.source_name.indexOf('%') === -1) {
          acc.push(source);
        }
        return acc;
      }, []);
      commit('templates', result.sort((a, b) => a.source_name.localeCompare(b.source_name)));
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
  getRevisions({ commit }, payload) {
    if (payload) {
      commit('revisions', payload.revisions.sort((a, b) => a.revision_converted.localeCompare(b.revision_converted)));
    } else {
      commit('revisions', payload);
    }
  },
  async getTemplateContent({ commit }, payload) {
    try {
      const result = await api.get('templates/template-content', payload);
      commit('templateContent', result.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
  async getInventoryInstances({ commit, state, dispatch }, instances) {
    if (state.instances) {
      const payload = await dispatch('cms/getUniqueInstancesId', null, { root: true });
      try {
        commit('inventoryInstances', instances.filter(i => payload.some(id => id === i.id)));
      } catch (error) {
        console.log(error);
        commit('error', error);
      }
    }
  },
  getFirstSelectedInstance({ commit }, payload) {
    commit('firstSelectedInstance', payload);
  },
  getSecondSelectedInstance({ commit }, payload) {
    commit('secondSelectedInstance', payload);
  },
  //get issue for CMS/Modification tab
  async getIssue({ commit, state }, ttsId) {
    try {
      const payload = {
        tts_id: ttsId,
        order_by: 'tts_id asc',
        with: JSON.stringify({
          project: {
            delivery_chains: {
              instances: {
                owner: {},
                status: {},
              },
              type: {},
              branches: {
                repo_type: {},
              },
              dc_role: {},
            },
          },
        }),
      };
      await apiMMPI.get('issues', payload).then((resp) => {
        const [issue] = resp.data.data;
        if (issue) {
          commit('issue', issue);
        }
      });
    } catch (error) {
      commit('error', error);
    }
  },
  //Get instanse status of CMS/Modification tab
  async getInstanceStatus({ commit, state }) {
    if (!state.instanceStatus) {
      try {
        await apiMMPI.get('enum-values', { type: 'instance_status' }).then((resp) => {
          commit('instanceStatus', resp.data.data);
        });
      } catch (error) {
        commit('error', error);
      }
    }
  },
  async checkVariableTemplates({ commit }, payload) {
    const name = 'cms-list-template';
    const promise = await api.get('cms/run-commands', payload);
    commit('promise', { name, promise }, { root: true });
    return promise.data;
  },
  async uploadRspFile({ commit }, payload) {
    const headers = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    try {
      await api.post('response-variables/uploadRspFile', payload, headers);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },

  async updateRspVariable({ commit }, payload) {
    try {
      const result = await api.put(`response-variables/${payload.id}`, payload);
      commit('updateRspVariable', result.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
    
  async submitTemplate({ state }, payload) {
    try {
      const response = await api.put('templates/template-content',
        {
          path: state.selectedTemplate.source_path,
          name: state.selectedTemplate.source_name,
          revision: state.selectedRevision.revision,
          content: payload.content,
          commitMsg: payload.commitMsg,
        });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  async firstInstanceVariables({ commit }, payload) {
    try {
      const resp = await api.get(`response-variables?instance_id=${payload.id}`);
      commit('firstInstanceVariables', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
  async secondInstanceVariables({ commit }, payload) {
    try {
      const resp = await api.get(`response-variables?instance_id=${payload.id}`);
      commit('secondInstanceVariables', resp.data.data);
    } catch (error) {
      console.log(error);
      commit('error', error);
    }
  },
  //Add modification in CMS/Modification tab
  async addModification({ commit }, payload) {
    try {
      //Commented rows below, because work just on page cms/modification other two pages are not currently functional
      // let uri = '';
      // if (payload.type_id === 'binary') {
      //   uri = 'binaries';
      // } else if (payload.type_id === 'cmd') {
      //   uri = 'commands';
      // } else if (payload.type_id === 'cms') {
      //   uri = 'cms';
      // }
      const response = await apiMMPI.post(`modifications/cms`, payload);
      return response.data.data;
    } catch (error) {
      console.log(error);
      commit('error', error);
      return error;
    }
  },

};
