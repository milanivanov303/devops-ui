<template>
  <div>
    <register/>
    <demo-table v-bind:request="request"/>
  </div>
</template>
<script>
import demoTable from '@/components/partials/Table';
import register from '@/components/demo/Register';

export default {
  components: {
    'demo-table': demoTable,
    register,
  },
  data() {
    return {
      request: {
        head: 'demo/demoKeys',
        body: 'demo/requstedDemos',
        action: 'demo/getDemos',
        columns: [
          'id',
          'active_from',
          'active_to',
        ],
        searchBy: 'name',
      },
    };
  },
};
</script>
