<template>
  <div class="row">
    <div class="col s12">
      <table v-if="instances.length">
        <thead>
          <tr>
            <th>Instance</th>
            <th>Virtual Machine</th>
            <th>Client</th>
            <th>PSU Version</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="instance in filteredInstances" :key="instance.id">
            <td>{{ instance.name }}</td>
            <td>{{ getVMName(instance.virtual_machine_id) }}</td>
            <td>{{ getProjectName(instance.name) }}</td>
            <td v-html="getPSU(instance.components)"></td>
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
      default: () => {},
    },
    virtualMachines: {
      type: Array,
      required: true,
      default: () => {},
    },
    projects: {
      type: Array,
      required: true,
      default: () => {},
    },
  },
  computed: {
    filteredInstances() {
      return this.instances.filter((i) => i.type !== 'extranet');
    },
    imxComponents() {
      return this.$store.state.esxi.imxComponents || [];
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
    getPSU(components) {
      const psu = this.imxComponents.find((component) => component.name_key === 'PSU');

      if (components && components['psu/cpu'] && psu) {
        const approved = psu.versions.filter((version) => version.approved === 'Yes');
        if (approved.find((a) => a.version_type === components['psu/cpu'])) {
          return `<span class="new badge green" data-badge-caption="">${components['psu/cpu']}</span>`;
        }
        return `<span class="new badge red" data-badge-caption="">${components['psu/cpu']}</span>`;
      }

      return '';
    },
  },
};
</script>
