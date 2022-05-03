<template>
  <div>
    <h3 class="center">Cms Modules Details</h3>
    <form>
      <div class="row">
        <div class="input-field col l5 m6 s6">
          <i class="material-icons prefix">memory</i>
          <label for="module" class="active">Module name</label>
          <input
              id="module"
              type="text"
              v-model="moduleName"
          />
          <div class="validator red-text" v-if="$v.moduleName.$error">
            <span v-if="!$v.moduleName.required">Module name field must not be empty.</span>
          </div>
        </div>
        <div class="input-field col s12 m4 l5">
          <i class="material-icons prefix">fullscreen_exit</i>
          <label for="moduleAbbrev" class="active">Module Abbreviation</label>
          <input
              id="moduleAbbrev"
              type="text"
              v-model="moduleAbbrev"
          />
          <div class="validator red-text" v-if="$v.moduleAbbrev.$error">
            <span v-if="!$v.moduleAbbrev.required">
              Module Abbreviation field must not be empty.</span>
          </div>
        </div>
        <button
            class="btn waves-effect waves-light"
            type="button"
            @click="addModule()">Add Module
        </button>
      </div>
    </form>

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
<!--            <span v-if="!$v.submoduleName.required">Submodule name field must not be empty.</span>-->
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
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="true"
        @delete="(row) => deleteModule(row, 'delete')"
        @update="(row) => openEditModal(row, 'update')">
      <Column show="name"/>
      <Column show="abbreviation"/>
      <Column show="submodules"/>
      <template v-slot:actions-before="{ row }">
        <a
            @click="openEditModal(row, 'update')"
            data-tooltip="Check/Update data"
            class="tooltipped">
          <i class="material-icons update">edit</i>
        </a>
      </template>
    </Table>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {

  data() {
    return {
      moduleName: '',
      moduleAbbrev: '',
      submoduleName: '',
      submoduleAbbrev: '',
      error: '',
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
    submodulesName() {

    }
  },
  methods: {
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

    async addSubmodule() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('cms/createSubmodule', {
        name: this.submoduleName,
        abbreviation: this.submoduleAbbrev,
      })
        .then(() => {
          this.$M.toast({ html: 'Submodule has been added!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      this.submoduleName = '';
      this.submoduleAbbrev = '';
      loader.hide();
    },
  },
  created() {
    this.$store.dispatch('cms/getModules');
  },
};
</script>
