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
            @click="showAddImxComponentModal=true">
          </TooltipButton>
        </div>
      </div>

      <div class="row">
        <ul id="imxComponents" class="collapsible expandable">
          <li v-for="component in imxComponents" :key="component.name">
            <div class="collapsible-header"><i class="material-icons">blur_on</i>
              {{ component.name }}
            </div>
            <div class="collapsible-body">
              <div class="col s12 m6 l1 right">
                <TooltipButton
                  v-if="$auth.can('imx-component.add')"
                  class="btn-floating right"
                  :icon="'edit'"
                  :tooltip="'Edit'"
                  @click="editComponent(component)">
                </TooltipButton>
              </div>
              <p>
                <b>Maintenance team: </b>
                <span v-if="component.maintenance_team">{{ component.maintenance_team }}</span>
              </p>
              <p>
                <b>Intranet command: </b>
                <span v-if="component.intranet_command">
                  {{ component.intranet_command }}
                </span>
              </p>
              <p>
                <b>Extranet command: </b>
                <span v-if="component.extranet_command">
                  {{ component.extranet_command }}
                </span>
              </p>
              <p><b>Versions:</b></p>
              <ol v-if="component.versions" id="component-versions" type="i">
                <li v-for="version in component.versions" :key="version.version" >
                  <span class="col l2" md="auto">
                    <b>Version </b>
                    <span v-if="version.version">{{ version.version }}</span>
                  </span>
                  <span class="col l4" md="auto">
                    <b>End of support date (regular): </b>
                    <span v-if="version.regular_eos_date">
                      {{ $date(version.regular_eos_date).toHuman('dd-MM-yyyy') }}
                    </span>
                  </span>
                  <span class="col l4">
                    <b>End of support date (extended): </b>
                    <span v-if="version.extended_eos_date">
                      {{ $date(version.extended_eos_date).toHuman('dd-MM-yyyy') }}
                    </span>
                  </span>
                </li>
              </ol>
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
