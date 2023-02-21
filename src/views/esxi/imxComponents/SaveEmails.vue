<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>
      <div >Save emails</div>
    </template>
    <template v-slot:content>
      <div class="row">
        <form class="col s10 l11">
          <fieldset>
            <legend>Save email</legend>
            <TextInput
              class="col s12 l5"
              label="Team/Person"
              v-model="newEmail.name"
              @blur="$v.newEmail.name.$touch()"
            />
            <TextInput
              class="col s14 l5"
              label="Email address"
              v-model="newEmail.email_address"
              @blur="$v.newEmail.email_address.$touch()"
            />
            <TooltipButton
              class="btn-floating btn-small green"
              icon="add"
              @click="saveEmail(newEmail, 'create')">
            </TooltipButton>
          </fieldset>
          </form>
      </div>
      <div class="row">
        <form class="col s10 l11">
          <fieldset v-if="savedEmails">
            <legend>Saved emails</legend>
            <template>
              <div>
                <input type="text" v-model="searchQuery" placeholder="Search by name or email" />
                <table>
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(email) in filteredEmails" :key="email.id">
                    <td>
                      <input type="text" v-model="email.name" />
                      <div class="validator">
                        <div class="red-text" v-if="!email.name">
                          <p>Name field must not be empty.</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="email"
                        v-model="email.email_address"
                        @blur="$v.email.email_address.$touch()"
                      />
                      <div class="validator">
                        <div class="red-text" v-if="!email.email_address">
                          <p>Email address field must not be empty.</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <TooltipButton
                        class="btn-floating btn-small green"
                        icon="edit"
                        @click="saveEmail(email, 'update')">
                      </TooltipButton>

                      <TooltipButton
                        class="btn-floating btn-small red"
                        icon="remove"
                        @click="removeSavedEmail(email)">
                      </TooltipButton>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </fieldset>
        </form>
      </div>
    </template>
    <template v-slot:footer>
    </template>
  </Modal>
</template>

<script>

import { required } from 'vuelidate/lib/validators';

const TooltipButton = () => import('@/components/partials/TooltipButton');
export default {
  components: {
    TooltipButton,
  },

  data() {
    return {
      email: null,
      searchQuery: '',
      newEmail: {
        name: '',
        email_address: '',
      },
    };
  },
  validations: {
    email: {
      email_address: {
        required,
      },
      name: {
        required,
      },
    },
  },
  computed: {
    savedEmails() {
      return this.$store.state.esxi.savedEmails;
    },

    filteredEmails() {
      return this.savedEmails.filter((email) => {
        const query = this.searchQuery.toLowerCase();
        return email.name.toLowerCase().includes(query)
          || email.email_address.toLowerCase().includes(query);
      });
    },
  },

  methods: {
    validEmailAddress(value) {
      return /^[\w.+-]+@[a-z\d.-]+\.[a-z]{2,}$/i.test(value);
    },

    saveEmail(email, action) {
      if (email.name === '' || email.email_address === '') {
        this.$M.toast({
          html: 'Name and email address cannot be null!',
          classes: 'toast-fail',
        });
        return;
      }
      if (!this.validEmailAddress(email.email_address)) {
        this.$M.toast({ html: 'Invalid email address!', classes: 'toast-fail' });
        return;
      }

      this.$store.dispatch(`esxi/${action}SavedEmail`, email)
        .then(() => {
          this.$M.toast({ html: `The email has been ${action}d!`, classes: 'toast-success' });
          if (action === 'create') {
            this.newEmail.name = '';
            this.newEmail.email_address = '';
          }
        })
        .catch((error) => {
          this.error = error;
        });
    },

    removeSavedEmail(email) {
      this.$store.dispatch('esxi/removeSavedEmail', email)
        .then(() => {
          this.$M.toast({ html: 'The email has been deleted!', classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
        });
    },

    getSavedEmails() {
      const loader = this.$loading.show({ container: this.$refs.savedEmails });

      this.$store.dispatch('esxi/getSavedEmails')
        .then(() => {
          loader.hide();
        }).catch((error) => {
          this.error = error;
        });
    },
  },

  created() {
    this.getSavedEmails();
  },
};

</script>
