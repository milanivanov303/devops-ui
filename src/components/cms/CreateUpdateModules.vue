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
                displayed="name"
                icon="developer_board"
                :options="submoduless"
                v-model="form.submodulesSelected"
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
      error: '',
      form: {},
      moduleName: '',
      moduleAbbrev: '',
      submodulesSelected: [],
    };
  },
  computed: {
    modules() {
      return this.$store.getters['cms/modules'];
    },
    submoduless() {
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
        dispatch = this.$store.dispatch('cms/createModule', {
          name: this.form.moduleName,
          abbreviation: this.form.moduleAbbrev,
          submodules: this.form.submodulesSelected,
        });
      } else if (this.action === 'update') {
        dispatch = this.$store.dispatch('cms/updateModule', this.form);
      }
      const loader = this.$loading.show({ container: this.$el });
      await dispatch
        .then(() => {
          this.$M.toast({ html: 'Module has been submitted!', classes: 'toast-success' });
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.error = error;
            this.$M.toast({ html: 'Module already exist!', classes: 'toast-fail' });
          }
          return error;
        });
      this.form = {};
      loader.hide();
      this.$emit('close');
    },
    setModalData() {
      this.form = {};
      if (this.action === 'update') {
        this.form.id = this.selectedModule.id;
        this.form.moduleName = this.selectedModule.name;
        this.form.moduleAbbrev = this.selectedModule.abbreviation;
        this.form.submodulesSelected = this.selectedModule.submodules;
      }
    },
    closeModal() {
      this.error = '';
      this.$v.$reset();
      this.$emit('close');
    },
  },
  mounted() {
    this.setModalData();
  },
};
</script>