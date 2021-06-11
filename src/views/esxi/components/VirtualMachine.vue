<template>
  <div class="card">
    <div class="card-content" >

      <div class="card-title truncate">
        Name: {{ virtualMachine.main_info.name }}
      </div>

      <div class="row">

        <div class="col s12 m12">
          <span><b>Main info</b></span>
          <p>File: {{ virtualMachine.file }}</p>
          <p>OS: {{ virtualMachine.main_info.guest_full_name }}</p>
          <p>version: {{ virtualMachine.main_info.version }}</p>
        </div>

        <div class="col s12 m12">
          <span><b>Hardware</b></span>
          <p>CPUs: {{ virtualMachine.hardware.num_c_p_u }}</p>
          <p>Cores per socket: {{ virtualMachine.hardware.num_cores_per_socket }}</p>
          <p>Memory: {{ bytesToSize(virtualMachine.hardware ? virtualMachine.hardware.memory : '') }}</p>
        </div>

        <div class="col s12 m12">
          <span><b>Flags</b></span>
          <p>Enable logging: {{ virtualMachine.flags.enable_logging }}</p>
          <p>Use toe: {{ virtualMachine.flags.use_toe }}</p>
          <p>Monitor type: {{ virtualMachine.flags.monitor_type }}</p>
          <p>HT sharing: {{ virtualMachine.flags.ht_sharing }}</p>
          <p>Snapshot disabled: {{ virtualMachine.flags.napshot_disabled }}</p>
          <p>Snapshot locked: {{ virtualMachine.flags.snapshot_locked }}</p>
          <p>Virtual MMU usage: {{ virtualMachine.flags.virtual_mmu_usage }}</p>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    module: String,
    virtualMachine: {},
  },

  methods: {
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (!bytes) {
        return '0 Byte';
      }

      const i = Math.floor(Math.log(bytes) / Math.log(1024));

      return `${Math.round(bytes / 1024 ** i)}  ${sizes[i]}`;
    },
  }
}
</script>
