<template>
  <div class="col s6 m6 l4">
    <div class="card">
      <div class="card-content">
        <span class="card-title">
          <router-link v-bind:to="'/extranet/branches/' + branch.name">
            {{ branch.name }}
          </router-link>
        </span>
        <p>Hash: {{ branch.hash }}</p>
        <p>Version: {{ branch.version }}</p>
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
