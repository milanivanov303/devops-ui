<template>
  <Modal class="right-sheet" @close="$emit('close')" >
    <template v-slot:header>
      <span v-if="action === 'create'">Create client</span>
      <span v-else>Update client</span>
    </template>

    <template v-slot:content>
      <form>
        <div class="row">
          <TextInput
              class="col s12"
              label="Config"
              v-model="client.config"
              :invalid="$v.client.config.$error"
              @blur="$v.client.config.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.client.config.$error">
              <p v-if="!$v.client.config.required">
                Config field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <TextInput
              class="col s12"
              label="Description"
              v-model="client.description"
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
      client: { ...this.selected },
    };
  },
  validations: {
    client: {
      config: {
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

      this.$store.dispatch(`pas/${this.action}Client`, { ...this.client })
        .then(() => {
          this.$M.toast({
            html: `The client has been ${this.action}d!`,
            classes: 'toast-success',
          });
          this.$emit('close');
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.$M.toast({
              html: `You do not have insufficient rights to ${this.action} this client`,
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
