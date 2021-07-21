<template>
  <router-link :to="getTo()">
    <div class="card">
      <div class="card-content">

        <div class="row">
          <div class="col s8 card-title truncate">
            {{ esxiHost.hostname }}
          </div>
          <div class="col s4">
            <a
              class="waves-effect waves-light btn-small update-button right"
              data-tooltip="Update info"
              v-if="$auth.can('esxi.add')"
              @click.prevent="updateEsxiInfo()"
            >
              <i class="material-icons left">refresh</i>Update
            </a>
          </div>
        </div>

        <div v-if="esxiHost.details && esxiHost.details.cpu">
          CPU: {{ esxiHost.details.cpu.c_p_u_cores ? esxiHost.details.cpu.c_p_u_cores : ''}} cores
          <span v-if="esxiHost.details.cpu_details">
            x {{ getCpuCoreSpeed(esxiHost.details.cpu_details) }}
          </span>
        </div>

        <div v-if="esxiHost.details && esxiHost.details.memory">
          RAM
          {{ bytesToSize(esxiHost.details.memory ? esxiHost.details.memory.physical_memory : '') }},
          Free {{ bytesToSize(freeMemory(esxiHost)) }}
        </div>

      </div>

    </div>
  </router-link>
</template>

<script>
import shared from '@/js/esxi/shared';

export default {
  props: {
    esxiHost: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getTo() {
      const query = { ...this.$route.query };
      query.esxiHost = this.esxiHost.hostname;

      return { query };
    },

    updateEsxiInfo() {
      const loader = this.$loading.show({ container: this.$el });
      const payload = { ...this.esxiHost };

      this.$store.dispatch('esxi/updateEsxiHost', payload)
        .then((response) => {
          if (response.data.error) {
            this.$M.toast({ html: response.data.error });
            return;
          }

          this.$M.toast({
            html: `Information about ESXi host ${this.esxiHost.hostname
            } has been updated!`,
            classes: 'toast-seccess',
          });
        })
        .catch((error) => {
          this.$M.toast({ html: error });
        }).finally(() => loader.hide());
    },
  },

  created() {
    this.bytesToSize = shared.bytesToSize;
    this.hertzToGigahertz = shared.hertzToGigahertz;
    this.getVmsMemory = shared.getVmsMemory;
    this.freeMemory = shared.freeMemory;
    this.getCpuCoreSpeed = shared.getCpuCoreSpeed;
  },
};

</script>

<style lang="scss" scoped>
.card-title {
  span {
    font-size: 12px;
  }
}

.update-button {
  font-size: 10px;
}

</style>
