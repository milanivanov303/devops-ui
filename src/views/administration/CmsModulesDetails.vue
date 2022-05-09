<template>
  <div>
    <h3 class="center">Cms Modules Details</h3>
<!--    <form>-->
<!--      <div class="row">-->
<!--        <div class="input-field col l3 m6 s4">-->
<!--          <i class="material-icons prefix">memory</i>-->
<!--          <label for="module" class="active">Module name</label>-->
<!--          <input-->
<!--              id="module"-->
<!--              type="text"-->
<!--              v-model="moduleName"-->
<!--          />-->
<!--          <div class="validator red-text" v-if="$v.moduleName.$error">-->
<!--            <span v-if="!$v.moduleName.required">Module name field must not be empty.</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="input-field col s12 m4 l3">-->
<!--          <i class="material-icons prefix">fullscreen_exit</i>-->
<!--          <label for="moduleAbbrev" class="active">Module Abbreviation</label>-->
<!--          <input-->
<!--              id="moduleAbbrev"-->
<!--              type="text"-->
<!--              v-model="moduleAbbrev"-->
<!--          />-->
<!--          <div class="validator red-text" v-if="$v.moduleAbbrev.$error">-->
<!--            <span v-if="!$v.moduleAbbrev.required">-->
<!--              Module Abbreviation field must not be empty.</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="col s12 m4 l4">-->
<!--          <Select-->
<!--              :multiple="true"-->
<!--              label="Submodules"-->
<!--              :options="submodules"-->
<!--              v-model="submodulesSelected"-->
<!--              displayed="name"-->
<!--              icon="developer_board"-->
<!--          />-->
<!--        </div>-->
<!--        <div class="col s12 m4 l2">-->
<!--          <button-->
<!--              class="btn waves-effect waves-light"-->
<!--              type="button"-->
<!--              @click="addModule()">Add Module-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </form>-->

<!--submodule form-->
<!--    <form>-->
<!--      <div class="row">-->
<!--        <div class="input-field col l5 m6 s6">-->
<!--          <i class="material-icons prefix">developer_board</i>-->
<!--          <label for="submodule" class="active">Submodule name</label>-->
<!--          <input-->
<!--              id="submodule"-->
<!--              type="text"-->
<!--              v-model="submoduleName"-->
<!--          />-->
<!--          <div class="validator red-text" v-if="$v.submoduleName.$error">-->
<!--            <span v-if="!$v.submoduleName.required">
Submodule name field must not be empty.</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="input-field col s12 m4 l5">-->
<!--          <i class="material-icons prefix">fullscreen_exit</i>-->
<!--          <label for="submoduleAbbrev" class="active">Submodule Abbreviation</label>-->
<!--          <input-->
<!--              id="submoduleAbbrev"-->
<!--              type="text"-->
<!--              v-model="submoduleAbbrev"-->
<!--          />-->
<!--          <div class="validator red-text" v-if="$v.submoduleAbbrev.$error">-->
<!--            <span v-if="!$v.submoduleAbbrev.required">-->
<!--              Submodule abbreviation field must not be empty.</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <button-->
<!--            class="btn waves-effect waves-light"-->
<!--            type="button"-->
<!--            @click="addSubmodule()">Add Submodule-->
<!--        </button>-->
<!--      </div>-->
<!--    </form>-->

    <Table
        :data="modules"
        sort-by="name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="true"
        :edit-btn="false"
        :delete-btn="true"
        @delete="(row) => deleteModule(row, 'delete')"
        @add="() => openAddEditModuleModal({}, 'add')"
        @update="(row) => openAddEditModuleModal(row, 'update')">
      <Column show="name"/>
      <Column show="abbreviation"/>
      <Column show="submodules"/>
      <template v-slot:actions-before="{ row }">
        <a
            @click="openAddEditModuleModal(row, 'update')"
            data-tooltip="Check/Update data"
            class="tooltipped">
          <i class="material-icons update">edit</i>
        </a>
      </template>
    </Table>

    <create-update-modules
        v-if="showAddEditModuleModal"
        @close="showAddEditModuleModal = false"
        :selectedModule="selectedModule"
        :action="action"
    />
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import CreateUpdateModules from '@/components/cms/CreateUpdateModules';

export default {
  components: {
    CreateUpdateModules,
  },
  data() {
    return {
      showAddEditModuleModal: false,
      moduleName: '',
      moduleAbbrev: '',
      error: '',
      submodulesSelected: [],
      action: null,
      selectedModule: {},
    };
  },
  validations: {
    moduleName: {
      required,
    },
    moduleAbbrev: {
      required,
    },
    submoduleName: {
      required,
    },
    submoduleAbbrev: {
      required,
    },
  },
  computed: {
    modules() {
      return this.$store.getters['cms/modules'];
    },
    submodules() {
      return this.$store.getters['cms/submodules'];
    },
  },
  methods: {
    openAddEditModuleModal(moduleDetails, action) {
      this.selectedModule = { ...moduleDetails };
      this.action = action;
      this.showAddEditModuleModal = true;
    },
    async addModule() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('cms/createModule', {
        name: this.moduleName,
        abbreviation: this.moduleAbbrev,
      })
        .then(() => {
          this.$M.toast({ html: 'Module has been added!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      this.moduleName = '';
      this.moduleAbbrev = '';
      loader.hide();
    },

    async updateModule() {
      // this.$v.$touch();
      // if (this.$v.$invalid) {
      //   return;
      // }
      // const loader = this.$loading.show({ container: this.$el });
      // await this.$store.dispatch('cms/createModule', {
      //   name: this.moduleName,
      //   abbreviation: this.moduleAbbrev,
      // })
      //   .then(() => {
      //     this.$M.toast({ html: 'Module has been updated!', classes: 'toast-seccess' });
      //   })
      //   .catch((error) => {
      //     this.error = error;
      //     return error;
      //   });
      // this.moduleName = '';
      // this.moduleAbbrev = '';
      // loader.hide();
    },

    deleteModule(data) {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/deleteModule', data.id)
        .then(() => {
          this.$M.toast({ html: 'Module has been deleted!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      loader.hide();
    },

    // async addSubmodule() {
    //   this.$v.$touch();
    //   if (this.$v.$invalid) {
    //     return;
    //   }
    //   const loader = this.$loading.show({ container: this.$el });
    //   await this.$store.dispatch('cms/createSubmodule', {
    //     name: this.submoduleName,
    //     abbreviation: this.submoduleAbbrev,
    //   })
    //     .then(() => {
    //       this.$M.toast({ html: 'Submodule has been added!', classes: 'toast-seccess' });
    //     })
    //     .catch((error) => {
    //       this.error = error;
    //       return error;
    //     });
    //   this.submoduleName = '';
    //   this.submoduleAbbrev = '';
    //   loader.hide();
    // },
  },
  created() {
    this.$store.dispatch('cms/getModules');
    this.$store.dispatch('cms/getSubmodules');
  },
};
</script>
