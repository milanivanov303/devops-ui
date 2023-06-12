<template>
  <Modal class="right-sheet" @close="$emit('close')" >
    <template v-slot:header>
      <span v-if="action === 'create'">Create new parameter</span>
      <span v-else>Update parameter {{ param.name }}</span>
    </template>

    <template v-slot:content>
      <form>
        <div class="row">
          <div class="col s12 m6">
            <Autocomplete
                label="Type"
                :items="types"
                v-model="param.type"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.param.type.$error">
                <p v-if="!$v.param.type.required">
                  Type field must not be empty.
                </p>
              </div>
            </div>
          </div>
          <div class="col s12 m6">
            <Autocomplete
                label="Category"
                :items="categories"
                v-model="param.category"
            />
            <div class="validator">
              <div class="red-text" v-if="$v.param.category.$error">
                <p v-if="!$v.param.category.required">
                  Category field must not be empty.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <TextInput
              class="col s12"
              label="Name"
              v-model="param.name"
              :invalid="$v.param.name.$error"
              @blur="$v.param.name.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.param.name.$error">
              <p v-if="!$v.param.name.required">
                Name field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <TextInput
              class="col s12"
              label="Description"
              v-model="param.description"
          />
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="save()">Save
      </button>
    </template>
  </Modal>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    action: String,
    selected: Object,
  },
  data() {
    return {
      error: '',
      param: { ...this.selected },
    };
  },
  computed: {
    types() {
      const types = this.$store.state.pas.params.map((params) => params.type);
      return types.filter((key, idx) => types.indexOf(key) === idx)
        .map((type) => ({ name: type }));
    },
    categories() {
      const categories = this.$store.state.pas.params.map((params) => params.category);
      return categories.filter((key, idx) => categories.indexOf(key) === idx)
        .map((category) => ({ name: category }));
    },
  },
  validations: {
    param: {
      name: {
        required,
      },
      type: {
        required,
      },
      category: {
        required,
      },
    },
  },
  methods: {
    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = { ...this.param };
      if (this.param.category.name) {
        payload.category = this.param.category.name;
      }

      this.$store.dispatch(`pas/${this.action}Param`, payload)
        .then(() => {
          this.$M.toast({
            html: `The parameter has been ${this.action}d!`,
            classes: 'toast-success',
          });
          this.$emit('close');
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.$M.toast({
              html: `You do not have insufficient rights to ${this.action} this parameter`,
              classes: 'toast-fail',
            });
            return;
          }

          this.$M.toast({ html: error, classes: 'toast-fail' });
        });
    },
  },
};
</script>
