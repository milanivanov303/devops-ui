// https://vuex.vuejs.org/en/mutations.html
import Vue from 'vue';

export default {
  error(state, error) {
    state.error = error;
  },

  variables(state, variables) {
    state.variables = variables;
  },
  updateVariable(state, variable) {
    state.variables.map((v) => {
      if (v.id === variable.id) {
        Vue.set(state.variables, state.variables.indexOf(v), variable);
      }
      return state.variables;
    });
  },
  createVariable(state, variable) {
    state.variables.push(variable);
  },

  modules(state, modules) {
    state.modules = modules;
  },
  modulesUpdate(state, request) {
    state.modules.map((a) => {
      if (a.id === request.id) {
        Vue.set(state.modules, state.modules.indexOf(a), request);
      }
      return state.modules;
    });
  },
  modulesRemove(state, id) {
    state.modules.splice(
      state.modules.findIndex((req) => req.id === id),
      1,
    );
  },
  rspVariables(state, rspVariables) {
    state.rspVariables = rspVariables;
  },
  selectedInstance(state, selectedInstance) {
    state.selectedInstance = selectedInstance;
  },
  projects(state, projects) {
    state.projects = projects;
  },
  selectedProject(state, selectedProject) {
    state.selectedProject = selectedProject;
  },
  instances(state, instances) {
    state.instances = instances;
  },
  deliveryChains(state, deliveryChains) {
    state.deliveryChains = deliveryChains;
  },
  selectedDeliveryChain(state, selectedDeliveryChain) {
    state.selectedDeliveryChain = selectedDeliveryChain;
  },
  codixTeams(state, codixTeams) {
    state.codixTeams = codixTeams;
  },
  codixTeamsTTS(state, codixTeamsTTS) {
    state.codixTeamsTTS = codixTeamsTTS;
  },
  updateRspVariable(state, rspVariable) {
    state.rspVariables.map((v) => {
      if (v.id === rspVariable.id) {
        Vue.set(state.rspVariables, state.rspVariables.indexOf(v), rspVariable);
      }
      return state.rspVariables;
    });
  },
  templates(state, templates) {
    state.templates = templates;
  },
  revisions(state, revisions) {
    state.revisions = revisions;
  },
  templateContent(state, templateContent) {
    state.templateContent = templateContent;
  },
  inventoryVariables(state, inventoryVariables) {
    state.inventoryVariables = inventoryVariables;
  },
  inventoryInstances(state, inventoryInstances) {
    state.inventoryInstances = inventoryInstances;
  },
  firstSelectedInstance(state, firstSelectedInstance) {
    state.firstSelectedInstance = firstSelectedInstance;
  },
  secondSelectedInstance(state, secondSelectedInstance) {
    state.secondSelectedInstance = secondSelectedInstance;
  },
  unregisteredVariables(state, unregisteredVariables) {
    state.unregisteredVariables = unregisteredVariables;
  },
  firstInstanceVariables(state, firstInstanceVariables) {
    state.firstInstanceVariables = firstInstanceVariables;
  },
  secondInstanceVariables(state, secondInstanceVariables) {
    state.secondInstanceVariables = secondInstanceVariables;
  },
  // Change issue/issues state in CMS/modification tab
  issue(state, issue) {
    state.issue = issue;
  },
  // Change instanse status state in CMS/modification tab
  instanceStatus(state, instanceStatus) {
    state.instanceStatus = instanceStatus;
  },
  updateTeams(state, teamValue) {
    state.teamValues.map((v) => {
      if (v.id === teamValue.id) {
        Vue.set(state.teamValues, state.teamValues.indexOf(v), teamValue);
      }
      return state.teamValues;
    });
  },
  submodules(state, submodules) {
    state.submodules = submodules;
  },
  submodulesUpdate(state, request) {
    state.submodules.map((a) => {
      if (a.id === request.id) {
        Vue.set(state.submodules, state.submodules.indexOf(a), request);
      }
      return state.submodules;
    });
  },
  submodulesRemove(state, id) {
    state.submodules.splice(
      state.submodules.findIndex((req) => req.id === id),
      1,
    );
  },
};
