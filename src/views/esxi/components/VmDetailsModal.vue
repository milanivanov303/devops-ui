<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>
      <p v-html="getTitle(vm)"></p>
    </template>
    <template v-slot:content>
      <div v-if="vm.error" class="row validator">
        <div class="col s12 red-text">
          <p>{{ vm.error }}</p>
        </div>
      </div>
      <ul class="collapsible popout">
        <li class="active">
          <div class="collapsible-header"><i class="material-icons">laptop</i>Main details</div>
          <div class="collapsible-body">
            <p v-if="vm.esxi"><b>ESXi Host: </b>
              <a :href="'../esxiHosts/' + vm.esxi.name" style="text-decoration: underline">
                {{ vm.esxi.name }}
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
            </div>
          </div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">camera</i>Hardware</div>
          <div class="collapsible-body">
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
        <li v-if="vm.instances">
          <div class="collapsible-header"><i class="material-icons">apps</i>Instances</div>
          <div class="collapsible-body ">
            <Instances :instances="vm.instances" :hideActions="false"/>
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
  </Modal>
</template>

<script>
import Instances from '../instances/Instances';
import ComponentsTable from './ComponentsTable';

export default {

  components: {
    Instances,
    ComponentsTable,
  },

  props: {
    vm: {
      type: Object,
      required: true,
    },
  },

  computed: {
    status() {
      return this.vm.powered;
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
  },

  mounted() {
    const elems = document.querySelectorAll('.collapsible');
    this.$M.Collapsible.init(elems);
  },

};
</script>

<style lang="scss" scooped>
span {
  margin-top: 4px;
}
</style>
