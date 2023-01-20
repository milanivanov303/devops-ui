<template>
  <div class="row" ref="san">
    <div>
      
    </div>
  </div>
</template>
<script>

import axios from 'axios';

export default {
    data() {
      return {
          response: '',
      }
    },
    mounted() {
      this.$store.dispatch(`esxi/makeRequest`)
        .finally((response) => {
          console.log(response.data);
        });
    },
}
</script>