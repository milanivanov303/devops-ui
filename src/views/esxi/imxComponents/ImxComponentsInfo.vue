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
              <TooltipButton
                v-if="$auth.can('imx-component.delete')"
                icon="delete"
                tooltip="Delete component"
                @click="openDeleteModal(component, 'delete')"
              />
            </div>
            <p v-if="component.url">
              <b>Url: </b><span>{{ component.url }}</span>

            <p v-if="component.name_key">
              <b>Name key: </b><span>{{ component.name_key }}</span>
            </p>

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
              <table>
                <thead>
                  <tr>
                    <th>Approved by Codix</th>
                    <th>Version</th>
                    <th>Version type</th>
                    <th>End of support date (extended)</th>
                    <th>End of support date (extended)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="v in component.versions" :key="v.id">
                    <td>
                      <span v-if="v.approved" class="new badge green" data-badge-caption="">
                        Yes
                      </span>
                      <span v-else class="new badge red" data-badge-caption="">
                        No
                      </span>
                    </td>
                    <td>{{ v.version }}</td>
                    <td>{{ v.version_type }}</td>
                    <td>{{ v.regular_eos_date ?
                        $date(v.regular_eos_date).toHuman('dd-MM-yyyy') : '' }}
                    </td>
                    <td>{{ v.extended_eos_date ?
                        $date(v.extended_eos_date).toHuman('dd-MM-yyyy') : '' }}
                    </td>
                  </tr>
                </tbody>
              </table>
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

      <DeleteImxComponentModal
        v-if="showDeleteComponent"
        :component="imxComponent"
        :action="action"
        @close="closeDelete()"
      />
    </div>
  </div>
</template>
<script>
const TooltipButton = () => import('@/components/partials/TooltipButton');
const AddImxComponentModal = () => import('./AddEditComponentModal');
const DeleteImxComponentModal = () => import('./DeleteImxComponentModal');

export default {
  components: {
    TooltipButton,
    AddImxComponentModal,
    DeleteImxComponentModal,
  },

  data() {
    return {
      showAddEditModal: false,
      imxComponent: {},
      error: '',
      action: null,
      showDeleteComponent: false,
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

    openDeleteModal(component, action) {
      this.showDeleteComponent = true;
      this.imxComponent = component;
      this.action = action;

      this.$router.push({
        path: `/inventory/imxComponents/${encodeURIComponent(component.id)}`,
      });
    },

    closeDelete() {
      this.showDeleteComponent = false;
      this.$router.push({
        path: '/inventory/imxComponents',
      })
        .catch(() => {
        });
    },

    close() {
      this.showAddEditModal = false;
      this.$router.push({
        path: '/inventory/imxComponents',
      })
        .catch(() => {
        });
    },
  },

  mounted() {
    this.getImxComponents();
    this.$M.Collapsible.init(document.querySelector('.collapsible.expandable'),
      {
        accordion: false,
      });
  },
};
</script>
