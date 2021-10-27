<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>
      <p v-html="getTitle(vm)"></p>
    </template>
    <template v-slot:content>
      <ul class="collapsible popout">
        <li class="active">
          <div class="collapsible-header"><i class="material-icons">laptop</i>Main details</div>
          <div class="collapsible-body">
            <p><b>File:</b> {{ vm.file }}</p>
            <p><b>OS:</b> {{ vm.main_info.guest_full_name }}</p>
            <p><b>Version:</b> {{ vm.main_info.version }}</p>
          </div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">apps</i>Instances</div>
          <div class="collapsible-body ">
            <div v-if="vm.instances.error" class="validator">
              <div class="red-text">
                <p>{{ vm.instances.error }}</p>
              </div>
            </div>
            <Instances v-else :instances="vm.instances"/>
          </div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">devices</i>Hardware</div>
          <div class="collapsible-body">
            <p><b>CPUs:</b> {{ vm.hardware.num_c_p_u }}</p>
            <p><b>Cores per socket:</b> {{ vm.hardware.num_cores_per_socket }}</p>
            <p><b>RAM:</b> {{ vm.hardware ? $esxi(vm.hardware.memory).bytesToSizeLabel() : '' }}</p>
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
      </ul>
    </template>
  </Modal>
</template>

<script>
import Instances from '../instances/Instances';

export default {

  components: {
    Instances,
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
      const { name } = vm.main_info;
      if (vm.powered === 'on') {
        return `${name} <span class="new badge green" data-badge-caption="">Powered ${vm.powered}</span>`;
      }
      if (vm.powered === 'off') {
        return `${name} <span class="new badge red" data-badge-caption="">Powered ${vm.powered}</span>`;
      }
      return name;
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
