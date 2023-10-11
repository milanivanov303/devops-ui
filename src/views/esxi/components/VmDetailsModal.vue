<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>
      <p v-html="getTitle(vm)"></p>
    </template>
    <template v-slot:content>
      <div class="row">
        <TextInput
            class="col s12"
            label="Comment"
            icon="dehaze"
            v-model="comments"
        />
      </div>
      <div v-if="vm.error" class="row validator">
        <div class="col s12 red-text">
          <span>{{ vm.error }}</span>
        </div>
      </div>
      <ul class="collapsible popout">
        <li class="active">
          <div class="collapsible-header"><i class="material-icons">laptop</i>Main details</div>
          <div class="collapsible-body">
            <p v-if="vm.esxi_host"><b>ESXi Host: </b>
              <a :href="'../esxiHosts/' + vm.esxi_host.name" class="tbl-link">
                {{ vm.esxi_host.name }}
              </a>
            </p>
            <p><b>File: </b> {{ vm.file }}</p>
            <div v-if="vm.os">
              <p>
                <b>OS: </b>
                <span v-if="vm.os.name">{{ vm.os.name }}</span>
                <span v-else class="validator">
                  <span class="red-text">{{ vm.os.error }}</span>
                </span>
              </p>
              <p v-if="vm.os.version "><b>OS Version:</b> {{ vm.os.version }}</p>
              <p v-if="vm.os.kernel "><b>OS Kernel:</b> {{ vm.os.kernel }}</p>
              <p v-if="vm.os.install_date "><b>OS Install Date:</b> {{ vm.os.install_date }}</p>
            </div>
          </div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">camera</i>Hardware</div>
          <div class="collapsible-body">
            <div v-if="vm.hardware.memoryReservation" class="row validator">
              <div class="col s12 red-text"> <span>{{ vm.hardware.memoryReservation }}</span></div>
            </div>
            <p><b>CPUs: </b> {{ vm.hardware.num_c_p_u }}</p>
            <p><b>Cores per socket: </b> {{ vm.hardware.num_cores_per_socket }}</p>
            <p><b>RAM: </b>
              {{ vm.hardware ? $esxi(vm.hardware.memory).bytesToSizeLabel() : '' }}
            </p>
          </div>
        </li>
        <li v-if="vm.vgdisplay">
          <div class="collapsible-header"><i class="material-icons">devices</i>VG display</div>
          <div class="collapsible-body">
            <p><b>VG Name: </b> {{ vm.vgdisplay.vg_name }}</p>
            <p><b>Format: </b> {{ vm.vgdisplay.format }}</p>
            <p><b>VG Size: </b> {{ vm.vgdisplay.vg_size }}</p>
            <p><b>Free/PE Size: </b> {{ vm.vgdisplay.free_pe_size }}</p>
          </div>
        </li>
        <li v-if="vm.openssl">
          <div class="collapsible-header"><i class="material-icons">cast</i>Open SSL</div>
          <div class="collapsible-body">
            <p><b>Version: </b> {{ vm.openssl.version }}</p>
            <p style="white-space: pre-wrap;">{{ vm.openssl.details }}</p>
          </div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">assistant_photo</i>Flags</div>
          <div class="collapsible-body">
            <p><b>Enable logging:</b> {{ vm.flags.enable_logging }}</p>
            <p><b>Use toe:</b> {{ vm.flags.use_toe }}</p>
            <p><b>Snapshot disabled:</b> {{ vm.flags.snapshot_disabled }}</p>
            <p><b>Snapshot locked:</b> {{ vm.flags.snapshot_locked }}</p>
          </div>
        </li>
        <li v-if="vm.instances && vm.instances.length > 0">
          <div class="collapsible-header"><i class="material-icons">apps</i>Instances</div>
          <div class="collapsible-body">
            <table class="responsive-table">
              <thead>
              <tr>
                <th>Instance</th>
                <th>Project</th>
                <th>Delivery Chain</th>
                <th>Version</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="instance in vm.instances" :key="instance.id">
                <td>
                  <a :href="'../instances?instances_search=' + instance.name" class="tbl-link">
                    {{instance.name}}
                  </a>
                </td>
                <td>{{ getProjectName(instance.name) }}</td>
                <td>{{ getDeliveryChain(instance.name) }}</td>
                <td>{{ instance.version }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li v-if="vm.components">
          <div class="collapsible-header"><i class="material-icons">widgets</i>Components</div>
          <div class="collapsible-body ">
            <ComponentsTable :components="vm.components"/>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:footer>
      <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="save()"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
import ComponentsTable from './ComponentsTable';

export default {
  components: {
    ComponentsTable,
  },

  props: {
    vm: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      comments: this.vm.comments,
    };
  },

  computed: {
    status() {
      return this.vm.powered;
    },
    projects() {
      return this.$store.state.mmpi.projects;
    },
  },

  methods: {
    getTitle(vm) {
      if (vm.powered === 'on') {
        return `${vm.name} <span class="new badge green" data-badge-caption="">Powered ${vm.powered}</span>`;
      }
      if (vm.powered === 'off') {
        return `${vm.name} <span class="new badge red" data-badge-caption="">Powered ${vm.powered}</span>`;
      }
      return vm.name;
    },
    getProjectName(instanceName) {
      let project = null;
      this.projects.forEach((p) => {
        p.delivery_chains.forEach((d) => {
          d.instances.forEach((i) => {
            if (i.name === instanceName) {
              project = p;
            }
          });
        });
      });
      return project ? project.name : '-';
    },
    getDeliveryChain(instanceName) {
      let deliveryChain = null;
      this.projects.forEach((p) => {
        p.delivery_chains.forEach((d) => {
          d.instances.forEach((i) => {
            if (i.name === instanceName) {
              deliveryChain = d;
            }
          });
        });
      });
      return deliveryChain ? deliveryChain.title : '-';
    },
    save() {
      this.$store.dispatch('esxi/updateVirtualMachine', {
        id: this.vm.id,
        comments: this.comments,
      })
        .then(() => {
          this.$emit('close');
          this.$M.toast({ html: 'Virtual Machine has been updated!', classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },

  mounted() {
    const elems = document.querySelectorAll('.collapsible');
    this.$M.Collapsible.init(elems);
    this.$store.dispatch('mmpi/getProjects');
  },

};
</script>

<style lang="scss" scoped>
span {
  margin-top: 4px;
}
.validator {
  margin-bottom: 10px;
}
</style>
