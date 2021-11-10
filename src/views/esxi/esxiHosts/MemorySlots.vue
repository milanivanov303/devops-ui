<template>
  <div class="row memory-slots">
    <ul v-if="esxiHost.details && esxiHost.details.memory_slots" class="collection with-header ul-collection">
      <div class="col s12 l6" v-if="esxiHost.details.memory_slots">
        <li class="collection-header">
          <span class="collection-section">EMPTY MEMORY SLOTS</span>
        </li>
        <div v-for="empty in esxiHost.details.memory_slots.empty" :key="empty.id">
          <div class="slots">
            <li class="collection-item">
              <b>Location: </b>{{ empty.location }}
            </li>
            <li class="collection-item">
              <b>Size: </b>{{ empty.size }}
            </li>
            <li class="collection-item">
              <b>Type: </b>{{ empty.type }}
            </li>
          </div>
          <br>
        </div>
      </div>
      <div class="col s12 l6">
        <li class="collection-header">
          <span class="collection-section">FILLED MEMORY SLOTS</span>
        </li>
        <div v-for="filled in esxiHost.details.memory_slots.filled" :key="filled.id">
          <div class="slots">
            <li class="collection-item">
              <b>Location: </b>{{ filled.location }}
            </li>
            <li class="collection-item">
              <b>Size: </b>{{ filled.size }}
            </li>
            <li class="collection-item">
              <b>Type: </b>{{ filled.type }}
            </li>
            <li class="collection-item">
              <b>Speed: </b>{{ filled.speed }}
            </li>
          </div>
          <br>
        </div>
      </div>
    </ul>
    <span v-else>Sorry! There is no data. Please update and try again.</span>
  </div>
</template>

<script>

export default {
  props: {
    esxiHost: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getCpuBrand(cpuDetails) {
      if (!cpuDetails[0]) {
        return null;
      }

      return cpuDetails[0].brand;
    },
    getCpuCoreSpeed(cpuDetails) {
      if (!cpuDetails[0]) {
        return null;
      }
      return this.$esxi(cpuDetails[0].core_speed).hertzToGigahertz();
    },
  },

};
</script>

<style lang="scss" scoped>
  .collection-section{
    font-size: 1.2em;
  }
  .ul-collection{
    border: none;
  }
  .memory-slots {
    padding-top: 20px;
  }
  .slots {
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
  }
  .collection-header {
    border-bottom: none !important;
  }
</style>
