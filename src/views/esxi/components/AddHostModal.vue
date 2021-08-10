<template>
  <Modal
    @close="$emit('close')"
    class="right-sheet">
    <template v-slot:header>
      <div v-if="action === 'create'">
        Add new ESXi host
      </div>
    </template>
    <template v-slot:content>
      <form class="col s12 l11">
        <div class="row">
          <div class="input-field col s12" :class="{invalid: $v.host.hostname.$error}">
            <i class="material-icons prefix">laptop</i>
            <input
              type="text"
              id="hostname"
              @blur="$v.host.hostname.$touch()"
              v-model="host.hostname">
            <label :class="{active: host.hostname}" for="hostname">Hostname*</label>
          </div>
          <div class="validator col s12 offset-l1 offset-m1">
            <div class="red-text" v-if="$v.host.hostname.$error">
              <p v-if="!$v.host.hostname.required">Hostname field must not be empty.</p>
            </div>
          </div>
        </div>
      </form>
      <div v-if="error" class="col s12 l11 error-message">
        {{ error }}
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn waves-effect waves-light"
        type="submit"
        name="action"
        @click="save()"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      error: '',
    };
  },

  props: {
    newHost: {
      type: Object,
      required: true,
    },
    action: String,
  },

  computed: {
    host() {
      return this.newHost;
    },
  },

  methods: {
    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = { ...this.host };

      this.$store.dispatch(`esxi/${this.action}Host`, payload)
        .then(() => {
          this.$emit('close');
          if (this.action === 'create') {
            this.$M.toast({ html: 'ESXi host has been created!', classes: 'toast-seccess' });
          }
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },

  validations() {
    const validations = {
      host: {
        hostname: {
          required,
        },
      },
    };

    return validations;
  },

};

</script>

<style scoped>
.error-message {
  color: #eb344f;
}
</style>
