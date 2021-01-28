<template>
  <Actions/>
</template>

<script lang="js">

export default {
  mounted() {
    if (!this.$auth.can('isAdmin')) {
      this.$router.push({
        path: '/dashboard',
      });
    }
  },
};

</script>
