<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">
        <router-link v-bind:to="'/extranet/branches/' + branch.name">
          {{ branch.name }}
        </router-link>
        <i
          v-if="container"
          :class="['material-icons', 'codix-text', 'text-' + container.State, 'right']"
        >
          fiber_manual_record
        </i>
      </span>
      <p>Hash: {{ branch.hash }}</p>
      <p>Version: {{ branch.version }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    branch: {},
    container: null,
  },
};
</script>
