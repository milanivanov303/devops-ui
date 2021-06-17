<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>{{ vm.main_info.name }}</template>
    <template v-slot:content>
      <ul class="collapsible popout">
        <li class="active">
          <div class="collapsible-header"><i class="material-icons">laptop</i>Main details</div>
          <div class="collapsible-body">
            <p>File: {{ vm.file }}</p>
            <p>OS: {{ vm.main_info.guest_full_name }}</p>
            <p>version: {{ vm.main_info.version }}</p>
          </div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">devices</i>Hardware</div>
          <div class="collapsible-body">
            <p>CPUs: {{ vm.hardware.num_c_p_u }}</p>
            <p>Cores per socket: {{ vm.hardware.num_cores_per_socket }}</p>
            <p>RAM: {{ bytesToSize(vm.hardware ? vm.hardware.memory : '') }}</p>
          </div>
        </li>
        <li>
          <div class="collapsible-header"><i class="material-icons">assistant_photo</i>Flags</div>
          <div class="collapsible-body">
            <p>Enable logging: {{ vm.flags.enable_logging }}</p>
            <p>Use toe: {{ vm.flags.use_toe }}</p>
            <p>Snapshot disabled: {{ vm.flags.napshot_disabled }}</p>
            <p>Snapshot locked: {{ vm.flags.snapshot_locked }}</p>
          </div>
        </li>
      </ul>
<!--      <ul class="collection with-header">-->
<!--        <li class="collection-header">-->
<!--          <span class="collection-section">Main details</span>-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          File: {{ vm.file }}-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          OS: {{ vm.main_info.guest_full_name }}-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          version: {{ vm.main_info.version }}-->
<!--        </li>-->
<!--        <li class="collection-header">-->
<!--          <span class="collection-section">Hardware</span>-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          CPUs: {{ vm.hardware.num_c_p_u }}-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          Cores per socket: {{ vm.hardware.num_cores_per_socket }}-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          RAM: {{ bytesToSize(vm.hardware ? vm.hardware.memory : '') }}-->
<!--        </li>-->
<!--        <li class="collection-header">-->
<!--          <span class="collection-section">Flags</span>-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          Enable logging: {{ vm.flags.enable_logging }}-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          Use toe: {{ vm.flags.use_toe }}-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          Snapshot disabled: {{ vm.flags.napshot_disabled }}-->
<!--        </li>-->
<!--        <li class="collection-item">-->
<!--          Snapshot locked: {{ vm.flags.snapshot_locked }}-->
<!--        </li>-->
<!--      </ul>-->
    </template>
  </Modal>
</template>

<script>
import shared from '@/js/esxi/shared';

export default {

  props: {
    vm: {
      type: Object,
      required: true,
    },
  },

  created() {
    this.bytesToSize = shared.bytesToSize;
  },

  mounted() {
    const elems = document.querySelectorAll('.collapsible');
    this.$M.Collapsible.init(elems);
  },

};
</script>

<style scoped>
.collection-section{
  font-size: 1.2em;
}
</style>
