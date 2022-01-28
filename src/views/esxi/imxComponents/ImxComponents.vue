<template>
  <div ref="imxComponents" class="row">
    <div class="col s12">
      <div class="row">
        <div class="col s12 m6">
          <p class="components-title">iMX Components</p>
        </div>
        <div class="col s12 m6 l1 right">
          <TooltipButton
            v-if="$auth.can('imx-component.add')"
            class="btn-floating right"
            :icon="'add'"
            :tooltip="'Add'"
            @click="showAddImxComponentModal=true"
          />
        </div>
      </div>

      <div class="row">
        <ul id="imxComponents" class="collapsible expandable">
          <li v-for="component in imxComponents" :key="component.name">
            <div class="collapsible-header">
              <i class="material-icons">blur_on</i> {{ component.name }}
            </div>
            <div class="collapsible-body">
              <div class="col s12 m6 l1 right">
                <TooltipButton
                  v-if="$auth.can('imx-component.add')"
                  class="btn-floating right"
                  :icon="'edit'"
                  :tooltip="'Edit'"
                  @click="editComponent(component)"
                />
              </div>
              <p v-if="component.maintenance_team">
                <b>Maintenance team: </b><span>{{ component.maintenance_team }}</span>
              </p>
              <p v-if="component.intranet_command">
                <b>Intranet command: </b><span>{{ component.intranet_command }}</span>
              </p>
              <p v-if="component.extranet_command">
                <b>Extranet command: </b><span>{{ component.extranet_command }}</span>
              </p>
              <div class="data-table" v-if="component.versions">
                <Table
                    :data="component.versions"
                    :searchField="false"
                    :pagination="false"
                    :export-btn="false"
                    :view-btn="false"
                    :add-btn="false"
                    :edit-btn="false"
                    :delete-btn="false"
                >
                  <Column show="version" :sortable="false"/>
                  <Column label="End of support date (regular)" name="regular_eos_date"
                          :sortable="false" :show="(v) => v.regular_eos_date
                          ? $date(v.regular_eos_date).toHuman('dd-MM-yyyy') : ''"/>
                  <Column label="End of support date (extended)" name="extended_eos_date"
                          :sortable="false" :show="(v) => v.extended_eos_date
                          ? $date(v.extended_eos_date).toHuman('dd-MM-yyyy') : ''"/>
                </Table>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <AddImxComponentModal
        v-if="showAddImxComponentModal"
        :imxComponent="imxComponent"
        :action="action"
        @close="updateAtClose()"
      />
    </div>
  </div>
</template>

<script>

import TooltipButton from '@/components/partials/TooltipButton';

const AddImxComponentModal = () => import('./AddImxComponentModal');

export default {
  components: {
    TooltipButton,
    AddImxComponentModal,
  },
  data() {
    return {
      imxComponent: {},
      action: 'save',
      showAddImxComponentModal: false,
    };
  },
  computed: {
    imxComponents() {
      return this.$store.state.esxi.imxComponents;
    },
  },
  methods: {
    editComponent(component) {
      this.imxComponent = component;
      this.action = 'edit';
      this.showAddImxComponentModal = true;
    },
    updateAtClose() {
      this.showAddImxComponentModal = false;
      this.imxComponent = {};
      this.action = 'save';
    },
  },
  created() {
    this.$store.dispatch('esxi/getImxComponents');
  },
  mounted() {
    const elem = document.querySelector('.collapsible.expandable');
    const globalM = window.M;
    globalM.Collapsible.init(elem, {
      accordion: false,
    });
  },
};

</script>

<style lang="scss" scooped>
.components-title {
  font-weight: bold;
  font-size: large;
}
</style>
