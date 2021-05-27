<template>
  <div class="card">
    <div class="card-content">
      <Alert v-if="branch.removed" msg="Branch does not exists or it was removed!" />

      <div class="card-title truncate">
        {{ branch.name }}
      </div>

      <Documentation
        v-if="module === 'extranet' || module === 'imx_be'"
        :repo="module"
        :branch="branch.name"
        class="documentation"
      />

      <Builds :branch="branch.name" :module="module"/>

      <template v-if="!branch.removed">
        <component :is="buildComponent"></component>
      </template>
    </div>
  </div>
</template>

<script>

const Builds = () => import('@/components/Builds');
const Documentation = () => import('@/components/documentation');

export default {
  components: {
    Documentation,
    Builds,
  },

  props: {
    module: String,
    branch: Object,
  },

  computed: {
    buildComponent() {
      // eslint-disable-next-line
      return () => import('@/views/' + this.module + '/components/Build');
    },
  },
};
</script>

<style scoped>
  .card-title{
    font-size: 2em;
  }
  .documentation {
    position: absolute;
    right: 2em;
    top: 2em;
  }
</style>
