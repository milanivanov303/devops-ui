<template>
  <div class="row" ref="imxComponents">
    <div class="col s12">
      <div class="row">
        <div class="col s12">
          <TooltipButton
            v-if="$auth.can('imx-component.add')"
            class="btn-floating right"
            icon="add"
            tooltip="Add"
            @click="openAddEditModal({}, 'create')"
          />
          <h6>Components info</h6>
        </div>
      </div>

      <ul id="imxComponents" class="collapsible expandable">
        <li v-for="component in imxComponents" :key="component.name">
          <div class="collapsible-header">
            <i class="material-icons">blur_on</i> {{ component.name }}
          </div>
          <div class="collapsible-body">
            <div class="right">
              <TooltipButton
                v-if="component.url"
                :href="component.url"
                target="_blank"
                icon="laptop_chromebook"
                tooltip="Lifecycle URL"
              />
              <TooltipButton
                v-if="$auth.can('imx-component.add')"
                icon="create"
                tooltip="Edit component"
                @click="openAddEditModal(component, 'update')"
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
                sort-by="version"
                sort-dir="desc"
                :perPage="5"
                :searchField="false"
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

      <AddImxComponentModal
        v-if="showAddEditModal"
        :component="imxComponent"
        :action="action"
        @close="close()"
      />
    </div>
  </div>
</template>

<script>
const TooltipButton = () => import('@/components/partials/TooltipButton');
const AddImxComponentModal = () => import('./AddEditComponentModal');

export default {
  components: {
    TooltipButton,
    AddImxComponentModal,
  },
  data() {
    return {
      showAddEditModal: false,
      imxComponent: {},
      action: '',
    };
  },
  computed: {
    imxComponents() {
      return this.$store.state.esxi.imxComponents;
    },
  },
  methods: {
    getImxComponents() {
      const loader = this.$loading.show({ container: this.$refs.imxComponents });

      this.$store.dispatch('esxi/getImxComponents')
        .then(() => {
          if (this.$route.params.id) {
            if (this.$route.params.id === 'new') {
              return this.openAddEditModal({}, 'create');
            }

            const component = this.imxComponents.find((c) => {
              if (c.id === parseInt(this.$route.params.id, 10)) {
                return true;
              }
              return false;
            });

            if (component) {
              return this.openAddEditModal(component, 'update');
            }
            this.$M.toast({ html: 'This component does not exist!', classes: 'toast-fail' });
          }
          return false;
        })
        .catch((error) => {
          this.$M.toast({ html: `${error}`, classes: 'toast-fail' });
        })
        .finally(() => loader.hide());
    },
    openAddEditModal(component, action) {
      this.showAddEditModal = true;
      this.imxComponent = component;
      this.action = action;

      this.$router.push({
        path: `/inventory/imxComponents/${encodeURIComponent(component.id || 'new')}`,
      });
    },
    close() {
      this.showAddEditModal = false;

      this.$router.push({
        path: '/inventory/imxComponents',
      })
        .catch(() => {});
    },
  },

  mounted() {
    this.getImxComponents();
    this.$M.Collapsible.init(document.querySelector('.collapsible.expandable'), {
      accordion: false,
    });
  },
};

</script>
