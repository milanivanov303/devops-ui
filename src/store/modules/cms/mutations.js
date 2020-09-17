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
  //Change issue/issues state in CMS/modification tab
  issue(state, issue) {
    state.issue = issue;
  },
  // Change instanse status state in CMS/modification tab
  instanceStatus(state, instanceStatus) {
    state.instanceStatus = instanceStatus;
  },
};
