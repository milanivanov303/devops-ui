<template>
  <div class="extranet-branch">
    {{ branch }}
    <Container v-bind:branch="branch"></Container>
  </div>
</template>

<script>
import Container from "@/components/extranet/Container";

export default {
  components: {
    Container
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    }
  }
};
</script>
