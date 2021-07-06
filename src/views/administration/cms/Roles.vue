<template>
  <Roles :application-code="applicationCode" uri-path="/administration/cms/roles"/>
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
      return config.cms.code;
    },
  },

  mounted() {
    if (!this.$auth.can('can-manage-authorizations', config.cms.code)) {
      this.$router.push({
        path: '/dashboard',
      });
    }
  },
};

</script>
