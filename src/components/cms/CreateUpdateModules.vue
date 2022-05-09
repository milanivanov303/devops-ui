<template>
  <Modal
      @close="$emit('close')"
      class="right-sheet">
    <template v-slot:header>
      <div v-if="action === 'add'">
        Add Module
      </div>
      <div v-else>
        Update Module
      </div>
    </template>
    <template v-slot:content>
      <form>
        <div class="row">
          <div class="input-field col l11 m6 s4">
            <i class="material-icons prefix">memory</i>
            <label for="module" class="active">Module name</label>
            <input
                id="module"
                type="text"
                v-model="form.moduleName"
            />
            <div class="validator red-text" v-if="$v.form.moduleName.$error">
              <span v-if="!$v.form.moduleName.required">Module name field must not be empty.</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12 m4 l11">
            <i class="material-icons prefix">fullscreen_exit</i>
            <label for="moduleAbbrev" class="active">Module Abbreviation</label>
            <input
                id="moduleAbbrev"
                type="text"
                v-model="form.moduleAbbrev"
            />
            <div class="validator red-text" v-if="$v.form.moduleAbbrev.$error">
            <span v-if="!$v.form.moduleAbbrev.required">
              Module Abbreviation field must not be empty.</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m4 l11">
            <Select
                :multiple="true"
                label="Submodules"
                :options="submodules"
                v-model="submodulesSelected"
                displayed="name"
                icon="developer_board"
            />
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
          class="btn waves-effect waves-light"
          type="button"
          @click="addUpdateModule()">Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    selectedModule: {
      type: Object,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      moduleName: '',
      moduleAbbrev: '',
      error: '',
      submodulesSelected: [],
      form: {},
    };
  },
  computed: {
    modules() {
      return this.$store.getters['cms/modules'];
    },
    submodules() {
      return this.$store.getters['cms/submodules'];
    },
  },
  validations: {
    form: {
      moduleName: {
        required,
      },
      moduleAbbrev: {
        required,
      },
    },
  },
  methods: {
    async addUpdateModule() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let dispatch = '';
      if (this.action === 'add') {
        dispatch = this.$store.dispatch('cms/createModule', this.form);
      } else if (this.action === 'update') {
        dispatch = this.$store.dispatch('cms/updateModule', this.form);
      }
      const loader = this.$loading.show({ container: this.$el });
      await dispatch
        .then(() => {
          this.$M.toast({ html: 'Module has been submitted!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      this.form = {};
      loader.hide();
      this.$emit('close');

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
      //     this.$M.toast({ html: 'Module has been added!', classes: 'toast-seccess' });
      //   })
      //   .catch((error) => {
      //     this.error = error;
      //     return error;
      //   });
      // this.moduleName = '';
      // this.moduleAbbrev = '';
      // loader.hide();
    },
    setModalData() {
      this.form = {};
      if (this.action === 'update') {
        this.form.id = this.selectedModule.id;
        this.form.name = this.selectedModule.name;
        this.form.abbreviation = this.selectedModule.abbreviation;
        this.form.submodules = this.selectedModule.submodules;
      }
    },
    closeModal() {
      this.error = '';
      this.$v.$reset();
      this.$emit('close');
    },
  },
  created() {
    this.$store.dispatch('cms/getModules');
    this.$store.dispatch('cms/getSubmodules');
  },
  mounted() {
    this.setModalData();
  },
};
</script>
