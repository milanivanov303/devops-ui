<template>
  <div class="row">
    <div class="col s12">

      <div class="row">
        <div class="col s12">
          <h4 class="center-align">Third-Party Components Matrix</h4>
        </div>
      </div>

      <div class="row">
        <div id="tabs" class="col s12">
          <ul class="tabs row">
            <li class="tab col s3" @click="switchUrl('psu')">
              <a href="#psu"
                :class="{active: !$route.params.module || $route.params.module === 'psu'}"
              >Oracle PSU</a>
            </li>
            <li class="tab col s3" @click="switchUrl('tomcat')">
              <a href="#tomcat"
                :class="{active: $route.params.module === 'tomcat'}"
              >Tomcat/HTTPD</a>
            </li>
            <li class="tab col s3" @click="switchUrl('db')">
              <a href="#db" :class="{active: $route.params.module === 'db'}">Oracle DB</a>
            </li>
            <li class="tab col s3" @click="switchUrl('os')">
              <a href="#os" :class="{active: $route.params.module === 'os'}">OS</a>
            </li>
          </ul>
          <div id="psu" class="comp-divs">
            <PSU
              :instances="instances"
              :virtual-machines="virtualMachines"
              :projects="projects"
            />
          </div>
          <div id="tomcat" class="comp-divs">
            <TomcatApache
              :instances="instances"
              :virtual-machines="virtualMachines"
              :projects="projects"
            />
          </div>
          <div id="db" class="comp-divs">
            <OracleDB
              :instances="instances"
              :virtual-machines="virtualMachines"
              :projects="projects"
            />
          </div>
          <div id="os" class="comp-divs">
            <table v-if="virtualMachines.length">
              <thead>
              <tr>
                <th>Virtual Machine</th>
                <th>OS version</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="vm in virtualMachines" :key="vm.id">
                <td>{{ vm.name }}</td>
                <td v-html="vm.os ? getOSLabel(vm.os): ''"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import PSU from './PSU';
import TomcatApache from './TomcatApache';
import OracleDB from './OracleDB';

export default {
  components: { PSU, TomcatApache, OracleDB },
  computed: {
    instances() {
      return this.$store.state.esxi.instances || [];
    },
    virtualMachines() {
      return this.$store.state.esxi.virtualMachines.filter((vm) => vm.powered === 'on') || [];
    },
    projects() {
      return this.$store.state.mmpi.projects || [];
    },
    imxComponents() {
      return this.$store.state.esxi.imxComponents || [];
    },
  },
  methods: {
    getData() {
      const loader = this.$loading.show({ container: this.$el });
      const promise1 = this.$store.dispatch('mmpi/getProjects');
      const promise2 = this.$store.dispatch('esxi/getInstancesSimple');
      const promise3 = this.$store.dispatch('esxi/getVirtualMachinesSimple');
      const promise4 = this.$store.dispatch('esxi/getImxComponents');

      Promise.all([promise1, promise2, promise3, promise4])
        .finally(() => loader.hide());
    },
    switchUrl(module) {
      this.$router.push({
        path: `/inventory/thirdParties/${module}`,
      });
    },

    getOSLabel(vmOs) {
      if (vmOs.error) {
        return `${vmOs.error}`;
      }
      const os = this.imxComponents
        .filter((component) => component.type === 'OS')
        .find((component) => vmOs.name.includes(component.name));

      if (os) {
        const approved = os.versions.filter((version) => version.approved === 'Yes');
        if (approved.find((a) => new RegExp(`^${a.version}`, 'i').test(vmOs.version))) {
          return `<span class="new badge green" data-badge-caption="">${vmOs.name} - ${vmOs.version}</span>`;
        }
        return `<span class="new badge red" data-badge-caption="">${vmOs.name} - ${vmOs.version}</span>`;
      }

      return `No matching iMX component for ${vmOs.name} - ${vmOs.version}`;
    },
  },
  mounted() {
    const elems = document.querySelectorAll('.tabs');
    this.$M.Tabs.init(elems);

    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.comp-divs {
  margin: 40px;
}
</style>
