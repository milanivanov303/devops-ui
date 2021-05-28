<template>
  <ul class="collapsible">
    <li v-if="error" class="active">
      <div class="collapsible-header red white-text">
        <i class="material-icons">error</i> Could not generate raml file. Click for details
      </div>
      <div class="collapsible-body">
        <pre>{{ error }}</pre>
      </div>
    </li>
    <li v-if="validationError">
      <div class="collapsible-header yellow">
        <i class="material-icons">info</i> There are validation errors. Click for details
      </div>
      <div class="collapsible-body">
        <pre>{{ validationError }}</pre>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    error: String,
    validationError: String,
  },

  mounted() {
    this.$M.Collapsible.init(
      document.querySelectorAll('.collapsible'),
    );
  },
};
</script>

<style lang="scss" scoped>
  .collapsible {
    .collapsible-header {
      padding: 5px;
      line-height: 1.6rem;
    }
  }
</style>
