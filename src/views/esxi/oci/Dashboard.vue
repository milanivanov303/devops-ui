<template>
  <div class="row">
    <div class="col s12">

      <div class="row">
        <div class="col s12">
          <h4 class="center-align">OCi Invenotry</h4>
        </div>
      </div>

      <div class="row">
        <div id="tabs" class="col s12">
          <ul class="tabs row">
            <li class="tab col s4" @click="switchUrl('regions')">
              <a href="#regions"
                 :class="{active: !$route.params.module || $route.params.module === 'regions'}"
              >Regions</a>
            </li>
            <li class="tab col s4" @click="switchUrl('compartments')">
              <a href="#compartments"
                 :class="{active: $route.params.module === 'compartments'}"
              >Compartments</a>
            </li>
            <li class="tab col s4" @click="switchUrl('instances')">
              <a href="#instances"
                 :class="{active: $route.params.module === 'instances'}"
              >Instances</a>
            </li>
          </ul>

          <div id="regions" class="comp-divs">
            <RegionsTable/>
          </div>
          <div id="compartments" class="comp-divs">
            <CompartmentsTable/>
          </div>
          <div id="instances" class="comp-divs">
            <InstancesTable/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegionsTable from './RegionsTable';
import CompartmentsTable from './CompartmentsTable';
import InstancesTable from './InstancesTable';

export default {
  components: {
    InstancesTable,
    CompartmentsTable,
    RegionsTable,
  },
  computed: {},
  methods: {
    switchUrl(module) {
      this.$router.push({
        path: `/inventory/oci/${module}`,
      });
    },
  },
  mounted() {
    const elems = document.querySelectorAll('.tabs');
    this.$M.Tabs.init(elems);
  },
};
</script>

<style lang="scss" scoped>
.comp-divs {
  margin: 40px;
}
</style>
