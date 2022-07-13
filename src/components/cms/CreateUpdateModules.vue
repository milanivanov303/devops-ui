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
                v-model="form.name"
            />
            <div class="validator red-text" v-if="$v.form.name.$error">
              <span v-if="!$v.form.name.required">Module name field must not be empty.</span>
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
                v-model="form.abbreviation"
            />
            <div class="validator red-text" v-if="$v.form.abbreviation.$error">
            <span v-if="!$v.form.abbreviation.required">
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
                v-model="form.submodules"
                :options="submodulesOp"
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
      name: '',
      abbreviation: '',
      submodules: [],
      submodulesOp: [],
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      abbreviation: {
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
        dispatch = this.$store.dispatch('cms/addModules', this.form);
      } else if (this.action === 'update') {
        dispatch = this.$store.dispatch('cms/updateModules', this.form);
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
      this.$emit('rerender');
      this.$emit('close');
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
    this.$store.dispatch('cms/getSubmodules').then(() => {
      this.submodulesOp = this.$store.state.cms.submodules;
    });
  },
  mounted() {
    this.setModalData();
  },
};
</script>
