<template>
  <Actions :application-code="applicationCode" uri-path="/administration/cms/actions"/>
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
      return config.cms.code;
    },
  },

  mounted() {
    if (!this.$auth.can('isAdmin', config.cms.code)) {
      this.$router.push({
        path: '/dashboard',
      });
    }
  },
};

</script>
