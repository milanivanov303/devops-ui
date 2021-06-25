<template>
  <Actions :application-code="applicationCode" uri-path="/administration/devops/actions"/>
</template>

<script>
import { Actions } from '@enterpriseapps/vue-administration';
import config from '@/config';

export default {
  components: {
    Actions,
  },

  computed: {
    applicationCode() {
      return config.devops.code;
    },
  },

  mounted() {
    if (!this.$auth.can('isAdmin')) {
      this.$router.push({
        path: '/dashboard',
      });
    }
  },
};

</script>
