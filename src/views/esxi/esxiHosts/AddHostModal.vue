<template>
  <Modal
    @close="$emit('close')"
    class="right-sheet">
    <template v-slot:header>Add new ESXi host</template>
    <template v-slot:content>
      <Alert v-if="error" :msg="error"/>
      <form class="col s12 l11">
        <div class="row">
          <div class="input-field col s12" :class="{invalid: $v.host.hostname.$error}">
            <i class="material-icons prefix">laptop</i>
            <input
              type="text"
              id="hostname"
              @blur="$v.host.hostname.$touch()"
              v-model="host.hostname">
            <label :class="{active: host.hostname}" for="hostname">Hostname</label>
          </div>
          <div class="validator col s12 offset-l1 offset-m1">
            <div class="red-text" v-if="$v.host.hostname.$error">
              <p v-if="!$v.host.hostname.required">Hostname field must not be empty.</p>
            </div>
          </div>
        </div>
      </form>
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
      host: {},
      error: null,
    };
  },

  validations: {
    host: {
      hostname: {
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

      this.$store.dispatch('esxi/createHost', this.host)
        .then(() => {
          this.$emit('close');
          this.$M.toast({ html: 'ESXi host has been created!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },
};

</script>
