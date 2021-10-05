<template>
  <Users :application-code="applicationCode" uri-path="/administration/devops/users"/>
</template>

<script>
import { Users } from '@enterpriseapps/vue-administration';
import config from '@/config';

export default {
  components: {
    Users,
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
