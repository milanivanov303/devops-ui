// https://vuex.vuejs.org/en/mutations.html
import Vue from 'vue';

export default {
  error(state, error) {
    state.error = error;
  },

  esxiHosts(state, esxiHosts) {
    state.esxiHosts = esxiHosts;
  },
  allVirtualMachines(state, virtualMachines) {
    state.allVirtualMachines = virtualMachines;
  },
  virtualMachines(state, virtualMachines) {
    state.virtualMachines = virtualMachines;
  },
  instances(state, instances) {
    state.instances = instances;
  },

  createHost(state, host) {
    const { esxiHosts } = state;
    esxiHosts.push(host);
    Vue.set(state, 'esxiHosts', esxiHosts);
  },
  updateHost(state, host) {
    state.esxiHosts.map((h) => {
      if (h.id === host.id) {
        Vue.set(state.esxiHosts, state.esxiHosts.indexOf(h), host);
      }
      return state.esxiHosts;
    });
  },

  updateVirtualMachine(state, virtualMachine) {
    state.virtualMachines.map((vm) => {
      if (vm.id === virtualMachine.id) {
        Vue.set(state.virtualMachines, state.virtualMachines.indexOf(vm), virtualMachine);
      }
      return state.virtualMachines;
    });
  },

  imxComponents(state, imxComponents) {
    state.imxComponents = imxComponents;
  },
  createImxComponent(state, imxComponent) {
    const { imxComponents } = state;
    imxComponents.push(imxComponent);
    Vue.set(state, 'imxComponents', imxComponents);
  },
  updateImxComponent(state, component) {
    if (!component.error) {
      const { imxComponents } = state;
      const index = imxComponents.findIndex((imxComponent) => imxComponent.id === component.id);
      imxComponents.splice(index, 1, component);
      Vue.set(state, 'imxComponents', imxComponents);
    }
  },
  removeImxComponent(state, id) {
    state.imxComponents.splice(
      state.imxComponents.findIndex((req) => req.id === id),
      1,
    );
  },

  requestedInstances(state, instances) {
    state.requestedInstances = instances;
  },
  requestInstance(state, instance) {
    const { requestedInstances } = state;
    requestedInstances.push(instance);
    Vue.set(state, 'requestedInstances', requestedInstances);
  },
  updateRequestedInstances(state, instance) {
    state.requestedInstances.map((i) => {
      if (i.id === instance.id) {
        Vue.set(state.requestedInstances, state.requestedInstances.indexOf(i), instance);
      }
      return state.requestedInstances;
    });
  },
  expiringComponents(state, expiringComponents) {
    state.expiringComponents = expiringComponents;
  },

  savedEmails(state, savedEmails) {
    state.savedEmails = savedEmails;
  },
  createSavedEmail(state, savedEmail) {
    const { savedEmails } = state;
    savedEmails.push(savedEmail);
    Vue.set(state, 'savedEmails', savedEmails);
  },
  updateSavedEmail(state, email) {
    if (!email.error) {
      const { savedEmails } = state;
      const index = savedEmails.findIndex((savedEmail) => savedEmail.id === email.id);
      savedEmails.splice(index, 1, email);
      Vue.set(state, 'savedEmails', savedEmails);
    }
  },
  removeSavedEmail(state, id) {
    state.savedEmails.splice(
      state.savedEmails.findIndex((req) => req.id === id),
      1,
    );
  },
};
