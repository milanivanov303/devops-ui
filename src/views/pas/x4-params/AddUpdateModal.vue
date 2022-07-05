<template>
  <Modal class="right-sheet" @close="$emit('close')" >
    <template v-slot:header>
      <span v-if="action === 'create'">Create {{selected.type}} parameter</span>
      <span v-else>Update {{selected.type}} parameter</span>
    </template>

    <template v-slot:content>
      <form>
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
  validations: {
    param: {
      name: {
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

      this.$store.dispatch(`pas/${this.action}X4Param`, { ...this.param })
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
