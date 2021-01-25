<template>
  <Users/>
</template>

<script lang="js">

export default {
  mounted() {
    if (!this.$auth.can('can-manage-authorizations')) {
      this.$router.push({
        path: '/dashboard',
      });
    }
  },
};

</script>
