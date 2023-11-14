<template>
  <div class="row">
    <div class="col s12">
      <table v-if="instances.length">
        <thead>
        <tr>
          <th>Instance</th>
          <th>Virtual Machine</th>
          <th>Client</th>
          <th>Tomcat Version</th>
          <th>Httpd Version</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="instance in intranet" :key="instance.id">
          <td>{{ instance.name }}</td>
          <td>{{ getVMName(instance.virtual_machine_id) }}</td>
          <td>{{ getProjectName(instance.name) }}</td>
          <td v-html="getTomcat(instance.components)"></td>
          <td v-html="getHTTPD(instance.components)"></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    instances: {
      type: Array,
      required: true,
      default: () => [],
    },
    virtualMachines: {
      type: Array,
      required: true,
      default: () => [],
    },
    projects: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    imxComponents() {
      return this.$store.state.esxi.imxComponents || [];
    },
    intranet() {
      return this.instances.filter((instance) => instance.type === 'intranet');
    },
  },
  methods: {
    getProjectName(instance) {
      let project = null;
      this.projects.forEach((p) => {
        p.delivery_chains.forEach((d) => {
          d.instances.forEach((i) => {
            if (i.name.toLowerCase() === instance.toLowerCase()) {
              project = p;
            }
          });
        });
      });
      return project ? project.name : '-';
    },
    getVMName(id) {
      return id && this.virtualMachines.length ? this.virtualMachines.find((vm) => vm.id === id).name : '';
    },
    getTomcat(components) {
      const tomcat = this.imxComponents.find((component) => component.name_key === 'tomcat');

      if (components && components.tomcat && tomcat) {
        const approved = tomcat.versions.filter((version) => version.approved === 'Yes');
        if (approved.find((a) => a.version === components.tomcat)) {
          return `<span class="new badge green" data-badge-caption="">${components.tomcat}</span>`;
        }
        return `<span class="new badge red" data-badge-caption="">${components.tomcat}</span>`;
      }

      return '';
    },
    getHTTPD(components) {
      const apache = this.imxComponents.find((component) => component.name_key === 'apache');

      if (components && components.apache && apache) {
        const approved = apache.versions.filter((version) => version.approved === 'Yes');
        if (approved.find((a) => a.version === components.tomcat)) {
          return `<span class="new badge green" data-badge-caption="">${components.apache}</span>`;
        }
        return `<span class="new badge red" data-badge-caption="">${components.apache}</span>`;
      }

      return '';
    },
  },
};
</script>
