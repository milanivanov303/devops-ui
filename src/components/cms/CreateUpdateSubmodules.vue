<template>
  <Modal
      @close="$emit('close')"
      class="right-sheet">
    <template v-slot:header>
      <div v-if="action === 'add'">
        Add Submodule
      </div>
      <div v-else>
        Update Submodule
      </div>
    </template>
    <template v-slot:content>
      <form>
        <div class="row">
          <div class="input-field col l11 m6 s4">
            <i class="material-icons prefix">memory</i>
            <label for="submodule" class="active">Submodule name</label>
            <input
                id="submodule"
                type="text"
                v-model="form.submoduleName"
            />
            <div class="validator red-text" v-if="$v.form.submoduleName.$error">
              <span v-if="!$v.form.submoduleName.required">
                Submodule name field must not be empty.</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12 m4 l11">
            <i class="material-icons prefix">fullscreen_exit</i>
            <label for="submoduleAbbrev" class="active">Submodule Abbreviation</label>
            <input
                id="submoduleAbbrev"
                type="text"
                v-model="form.submoduleAbbrev"
            />
            <div class="validator red-text" v-if="$v.form.submoduleAbbrev.$error">
            <span v-if="!$v.form.submoduleAbbrev.required">
              Submodule abbreviation field must not be empty.</span>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
          class="btn waves-effect waves-light"
          type="button"
          @click="addUpdateSubmodule()">Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    selectedSubmodule: {
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
      submoduleName: '',
      submoduleAbbrev: '',
    };
  },
  computed: {
    submodules() {
      return this.$store.getters['cms/submodules'];
    },
  },
  validations: {
    form: {
      submoduleName: {
        required,
      },
      submoduleAbbrev: {
        required,
      },
    },
  },
  methods: {
    async addUpdateSubmodule() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let dispatch = '';
      if (this.action === 'add') {
        dispatch = this.$store.dispatch('cms/createSubmodule', {
          name: this.form.submoduleName,
          abbreviation: this.form.submoduleAbbrev,
        });
      } else if (this.action === 'update') {
        dispatch = this.$store.dispatch('cms/updateSubmodule', this.form);
      }
      const loader = this.$loading.show({ container: this.$el });
      await dispatch
        .then(() => {
          this.$M.toast({ html: 'Submodule has been submitted!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
      this.form = {};
      loader.hide();
      this.$emit('close');
    },
    setModalData() {
      this.form = {};
      if (this.action === 'update') {
        this.form.id = this.selectedSubmodule.id;
        this.form.submoduleName = this.selectedSubmodule.name;
        this.form.submoduleAbbrev = this.selectedSubmodule.abbreviation;
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
