<template>
  <div class="extranet-branch">
    <div class="row" >
      <div class="col s12" >
        <h4>Branch</h4>
        <p>Name: {{ branch }}</p>
      </div>
    </div>

    <Container v-bind:branch="branch"></Container>
  </div>
</template>

<script>
import Container from '@/components/extranet/Container';

export default {
  components: {
    Container,
  },
  computed: {
    branch() {
      return this.$route.params.branch;
    },
  },
};
</script>
