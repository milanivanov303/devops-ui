<template>
  <div class="col s6 m6 l4">
    <div class="card">
      <div class="card-content">
        <span class="card-title">{{ branch.name }}</span>
        <p>Hash: {{ branch.hash }}</p>
        <p>Version: {{ branch.version }}</p>
      </div>
      <div class="card-action">
        <router-link v-bind:to="'/extranet/' + branch.name">Open test environment</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    branch: {}
  }
};
</script>
