// https://vuex.vuejs.org/en/actions.html
import { DateTime } from 'luxon';

export default {
  // SAN
  getSanData({ commit }) {
    const promise = api('devops').get('inventory/san');

    promise
      .then((response) => commit('san', response.data))
      .catch((error) => commit('error', error));
    return promise;
  },

  // OCi
  getOciRegions({ commit }) {
    const name = 'oci-regions';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/oci/regions');

    promise
      .then((response) => {
        commit('ociRegions', response.data.data);
      })
      .catch(() => commit('error', 'Could not get a list with OCi regions', { root: true }));
    return promise;
  },
  getOciCompartments({ commit }) {
    const name = 'oci-compartments';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/oci/compartments');

    promise
      .then((response) => {
        commit('ociCompartments', response.data.data);
      })
      .catch(() => commit('error', 'Could not get a list with OCi compartments', { root: true }));
    return promise;
  },
  getOciInstances({ commit }) {
    const name = 'oci-instances';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/oci/instances', {
      with: JSON.stringify(['compartment']),
    });

    promise
      .then((response) => {
        commit('ociInstances', response.data.data);
      })
      .catch(() => commit('error', 'Could not get a list with OCi instances', { root: true }));
    return promise;
  },

  updateSingleHost({ commit }, payload) {
    const promise = api('devops').post('inventory/start-single-update', payload);
    promise
      .catch((error) => commit('error', error));
    return promise;
  },
  updateInfo({ commit }, payload) {
    const promise = api('devops').post('inventory/start-info-update', payload);
    promise
      .catch((error) => commit('error', error));
    return promise;
  },
  updateComponents({ commit }, payload) {
    const promise = api('devops').post('inventory/start-components-update', payload);
    promise
      .catch((error) => commit('error', error));
    return promise;
  },

  getEsxiHosts({ commit }) {
    const name = 'esxiHosts';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/esxi-hosts', {
      with: JSON.stringify(['virtualMachines']),
    });

    promise
      .then((response) => {
        commit('esxiHosts', response.data.data);
      })
      .catch(() => commit('error', 'Could not get servers\' list', { root: true }));
    return promise;
  },
  createHost({ commit }, payload) {
    const promise = api('devops').post('inventory/esxi-hosts', payload);

    promise
      .then((response) => commit('createHost', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  updateHost({ commit }, payload) {
    const promise = api('devops').put(`inventory/esxi-hosts/${payload.id}`, payload);

    promise
      .then((response) => commit('updateHost', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },

  getVirtualMachines({ commit }) {
    const name = 'virtualMachines';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/virtual-machines', {
      with: JSON.stringify(['esxiHost', 'instances']),
    });

    promise
      .then((response) => {
        commit('virtualMachines', response.data.data);
      })
      .catch(() => commit('error', 'Could not get virtual machines', { root: true }));
    return promise;
  },
  getVirtualMachinesSimple({ commit }) {
    const name = 'virtualMachines-simple';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/virtual-machines', {
      orders: JSON.stringify({
        name: 'asc',
      }),
    });

    promise
      .then((response) => {
        commit('virtualMachines', response.data.data);
      })
      .catch(() => commit('error', 'Could not get virtual machines', { root: true }));
    return promise;
  },
  updateVirtualMachine({ commit }, payload) {
    const promise = api('devops').put(`inventory/virtual-machines/${payload.id}`, payload);

    promise
      .then((response) => commit('updateVirtualMachine', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },

  getInstances({ commit }) {
    const name = 'instances';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/instances', {
      with: JSON.stringify({
        virtualMachine: {
          esxiHost: {},
        },
      }),
    });

    promise
      .then((response) => {
        commit('instances', response.data.data);
      })
      .catch(() => commit('error', 'Could not get instances\' list', { root: true }));
    return promise;
  },
  getInstancesSimple({ commit }) {
    const name = 'instances-simple';

    if (this.state.promises[name]) {
      return this.state.promises[name];
    }

    const promise = api('devops').get('inventory/instances', {
      orders: JSON.stringify({
        name: 'asc',
      }),
    });

    promise
      .then((response) => {
        commit('instances', response.data.data);
      })
      .catch(() => commit('error', 'Could not get instances\' list', { root: true }));
    return promise;
  },
  exportInstanceComponents({ commit }) {
    const promise = api('devops').post('inventory/instances/export',
      {},
      { responseType: 'blob' });
    promise
      .catch((error) => commit('error', error));
    return promise;
  },

  getImxComponents({ commit }) {
    const promise = api('devops').get('inventory/imx-components');

    promise
      .then((response) => {
        commit('imxComponents', response.data.data);
      })
      .catch(() => commit('error', 'Could not get iMX components', { root: true }));
    return promise;
  },
  createImxComponent({ commit }, payload) {
    const promise = api('devops').post('inventory/imx-components', payload);

    promise
      .then((response) => commit('createImxComponent', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  updateImxComponent({ commit }, payload) {
    const promise = api('devops').put(`inventory/imx-components/${payload.id}`, payload);

    promise
      .then((response) => commit('updateImxComponent', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  removeImxComponent({ commit }, payload) {
    const promise = api('devops').delete(`inventory/imx-components/${payload.id}`);
    promise
      .then(() => {
        commit('removeImxComponent', payload.id);
      })
      .catch(() => commit('error', 'Could not remove imx component'));
    return promise;
  },
  // OS for request instance form
  // getOsComponents({ commit }) {
  //   const promise = api('devops').get('inventory/imx-components', {
  //     filters: JSON.stringify({
  //       allOf: [
  //         {
  //           type: 'OS',
  //         },
  //       ],
  //     }),
  //   });
  //
  //   promise
  //     .then((response) => {
  //       commit('osPlatforms', response.data.data);
  //     })
  //     .catch(() => commit('error', 'Could not get iMX OS components', { root: true }));
  //   return promise;
  // },

  getRequestedInstances({ commit }) {
    const promise = api('devops').get('inventory/requested-instances');

    promise
      .then((response) => {
        commit('requestedInstances', response.data.data);
      })
      .catch(() => commit('error', 'Could not get servers\' list', { root: true }));
    return promise;
  },
  createRequestedInstance({ commit }, payload) {
    const promise = api('devops').post('inventory/requested-instances', payload);

    promise
      .then((response) => commit('requestInstance', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  updateRequestedInstance({ commit }, payload) {
    const promise = api('devops').put(`inventory/requested-instances/${payload.id}`, payload);

    promise
      .then((response) => commit('updateRequestedInstances', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  exportRecord({ commit }, id) {
    const promise = api('devops').post(`inventory/requested-instances/export/${id}`,
      {},
      { responseType: 'blob' });
    promise
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');

        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'Request_Instance_Details.xlsx');
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch((error) => commit('error', error));
    return promise;
  },

  getExpiringComponents({ commit }) {
    const promise = api('devops').get('inventory/imx-components/expiring');
    promise
      .then((response) => commit('expiringComponents', response.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  getExpiringComponentsExport({ commit }, payload) {
    const promise = api('devops').post(
      'inventory/imx-components/expiring/export',
      payload,
      {
        responseType: 'blob',
      },
    );
    promise
      .then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', `${DateTime.local().toFormat('dd_MM_y')}_expiring_imx_components.xlsx`);
        document.body.appendChild(fileLink);
        fileLink.click();
      })
      .catch((error) => commit('error', error));
    return promise;
  },

  getSavedEmails({ commit }) {
    const promise = api('devops').get('inventory/saved-emails');

    promise
      .then((response) => {
        commit('savedEmails', response.data.data);
      })
      .catch(() => commit('error', 'Could not get saved emails', { root: true }));
    return promise;
  },
  createSavedEmail({ commit }, payload) {
    const promise = api('devops').post('inventory/saved-emails', payload);

    promise
      .then((response) => commit('createSavedEmail', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  updateSavedEmail({ commit }, payload) {
    const promise = api('devops').put(`inventory/saved-emails/${payload.id}`, payload);

    promise
      .then((response) => commit('updateSavedEmail', response.data.data))
      .catch((error) => commit('error', error));
    return promise;
  },
  removeSavedEmail({ commit }, payload) {
    const promise = api('devops').delete(`inventory/saved-emails/${payload.id}`);
    promise
      .then(() => {
        commit('removeSavedEmail', payload.id);
      })
      .catch(() => commit('error', 'Could not remove saved email'));
    return promise;
  },
};
