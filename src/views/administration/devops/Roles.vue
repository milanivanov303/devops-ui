<template>
  <Roles :application-code="applicationCode" uri-path="/administration/devops/roles"/>
</template>

<script>
import { Roles } from '@enterpriseapps/vue-administration';
import config from '@/config';

export default {
  components: {
    Roles,
  },

  computed: {
    applicationCode() {
      return config.devops.code;
    },
  },

  mounted() {
    if (!this.$auth.can('can-manage-authorizations')) {
      this.$router.push({
        path: '/dashboard',
      });
    }
  },
};

</script>
