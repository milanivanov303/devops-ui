<template>
  <div class="row">

    <div class="col s12 m6">
      <p>CPU id: {{ cpu.id }}</p>
      <p>Brand: {{ cpu.brand }}</p>
      <p v-if="cpu.core_speed">Core speed: {{ hertzToGigahertz(cpu.core_speed) }}</p>
      <p v-if="cpu.bus_speed">Bus speed: {{ hertzToGigahertz(cpu.bus_speed) }}</p>
    </div>

  </div>
</template>

<script>

import shared from '@/js/esxi/shared';

export default {

  props: {
    cpu: {
      type: Object,
      required: true
    },
  },

  created() {
    this.hertzToGigahertz = shared.hertzToGigahertz
  },

}
</script>
