<template>
  <Modal class="right-sheet" @close="$emit('close')">
      <template v-slot:header>
          <span v-if="action === 'create'">Add new ESXi host</span>
          <span v-if="action === 'update'">Edit ESXi host</span>
        </template>
      <template v-slot:content>
        <Alert v-if="error" :msg="error"/>
        <form class="col s12 l11">
          <div class="row">
            <TextInput
                class="col s12"
                label="Hostname"
                icon="laptop"
                v-model="host.name"
            />
          </div>
          <div class="row">
            <TextInput
                class="col s12"
                label="Documentation URL"
                icon="import_contacts"
                v-model="host.doc_url"
            />
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="purchase_date"
                        input-class="datetime-input"
                        type="date"
                        v-model="host.purchase_date"
                        class="datetime-theme"
                        :format="$date.format"
                        :week-start="1"/>
              <label :class="{active: host.purchase_date}"
                     for="purchase_date">Purchase date
              </label>
            </div>
            <div class="input-field col s12 m6 l6">
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="expiration_date"
                        input-class="datetime-input"
                        type="date"
                        v-model="host.expiration_date"
                        class="datetime-theme"
                        :format="$date.format"
                        :week-start="1"/>
              <label :class="{active: host.expiration_date}"
                     for="expiration_date">Expiration date
              </label>
            </div>
          </div>

          <div class="row">
            <TextInput
                class="col s12"
                label="Notes"
                icon="subject"
                v-model="host.notes"
            />
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
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';

export default {
  props: {
    action: { default: 'create', String },
    currentHost: { Object },
  },
  components: {
    datetime: Datetime,
  },
  data() {
    return {
      error: null,
      host: this.currentHost,
    };
  },
  validations: {
    host: {
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

      this.$store.dispatch(`esxi/${this.action}Host`, {
        id: this.host.id,
        name: this.host.name,
        doc_url: this.host.doc_url,
        purchase_date: this.$date(this.host.purchase_date).toSeconds(),
        expiration_date: this.$date(this.host.expiration_date).toSeconds(),
        notes: this.host.notes,
      })
        .then(() => {
          this.$emit('close');
          this.$M.toast({ html: `ESXi host has been ${this.action}d!`, classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },
};

</script>
