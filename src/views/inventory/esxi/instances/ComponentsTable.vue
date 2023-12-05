<template>
  <div ref="components">
    <div class="data-table">
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Version</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="component in components" :key="component.id">
            <td>{{ component.name }}</td>
            <td>{{ component.version }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    components: {
      type: Array,
    },
  },
};
</script>
