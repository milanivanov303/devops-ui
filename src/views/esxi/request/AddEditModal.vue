<template>
  <Modal class="right-sheet" @close="$emit('close')">
      <template v-slot:header>
          <span v-if="action === 'create'">Request new instance</span>
          <span v-if="action === 'update'">Edit instance</span>
        </template>
      <template v-slot:content>
        <Alert v-if="error" :msg="error"/>
        <form class="col s12 l11">
          <div class="row">
            <div class="col s12">
              <Autocomplete
                  label="Project"
                  :items="projects"
                  v-model="selected.project"
                  :invalid="$v.selected.project.$error"
                  @change="delete selected.delivery_chain"
                  @blur="$v.selected.project.$touch()"
              />
              <div class="validator col s12">
                <div class="red-text" v-if="$v.selected.project.$error">
                  <p v-if="!$v.selected.project.required">Project field must not be empty.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                  label="Delivery chain"
                  valueKey="title"
                  :items="projectDeliveryChains"
                  v-model="selected.delivery_chain"
                  :invalid="$v.selected.delivery_chain.$error"
                  @blur="$v.selected.delivery_chain.$touch()"
                  @change="delete selected.dc_role"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.delivery_chain.$error">
                  <p v-if="!$v.selected.delivery_chain.required">
                    Delivery chain field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Delivery chain role"
                  :items="deliveryChainRoles"
                  valueKey="value"
                  v-model="selected.dc_role"
                  :invalid="$v.selected.dc_role.$error"
                  @blur="$v.selected.dc_role.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.dc_role.$error">
                  <p v-if="!$v.selected.dc_role.required">
                    Delivery chain role field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12 m6">
              <Autocomplete
                  label="Instance type"
                  :items="instanceTypes"
                  valueKey="type"
                  v-model="selected.instance_type"
                  :invalid="$v.selected.instance_type.$error"
                  @blur="$v.selected.instance_type.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.instance_type.$error">
                  <p v-if="!$v.selected.instance_type.required">
                    Instance type field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Environment type"
                  :items="environmentTypes"
                  valueKey="title"
                  v-model="selected.environment_type"
                  :invalid="$v.selected.environment_type.$error"
                  @blur="$v.selected.environment_type.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.environment_type.$error">
                  <p v-if="!$v.selected.environment_type.required">
                    Environment type field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <TextInput
                class="col s12"
                label="Comments"
                v-model="selected.comments"
            />
          </div>
          <div class="row">
            <Select class="col s12 m6"
              label="Mail"
              displayed="name"
              :options="[{ name:'Yes', value:1 },{ name:'No', value:0 }]"
              v-model="selected.mail"
            />
            <Select class="col s12 m6"
              label="Telephony"
              displayed="name"
              :options="[{ name:'Yes', value:1 },{ name:'No', value:0 }]"
              v-model="selected.telephony"
            />
          </div>
          <div class="row">
            <Select class="col s12 m6"
              label="Fax"
              displayed="name"
              :options="[{ name:'Yes', value:1 },{ name:'No', value:0 }]"
              v-model="selected.fax"
            />
            <Select class="col s12 m6"
              label="SMS"
              displayed="name"
              :options="[{ name:'Yes', value:1 },{ name:'No', value:0 }]"
              v-model="selected.sms"
            />
          </div>
          <div class="row">
            <Select class="col s12 m6"
              label="Imagerie"
              displayed="name"
              :options="[{ name:'Yes', value:1 },{ name:'No', value:0 }]"
              v-model="selected.imagerie"
            />
            <Select class="col s12 m6"
              label="Archivage"
              displayed="name"
              :options="[{ name:'Yes', value:1 },{ name:'No', value:0 }]"
              v-model="selected.archivage"
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
          <span v-if="action==='create'">Request</span>
          <span v-else>Save</span>
        </button>
      </template>
    </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    action: { String, default: 'create' },
    request: { Object, default: {} },
  },
  data() {
    return {
      error: null,
      selected: {},
    };
  },
  validations: {
    selected: {
      project: {
        required,
      },
      delivery_chain: {
        required,
      },
      dc_role: {
        required,
      },
      instance_type: {
        required,
      },
      environment_type: {
        required,
      },
    },
  },
  computed: {
    projects() {
      return this.$store.state.mmpi.activeProjects || [];
    },
    projectDeliveryChains() {
      if (this.selected.project && this.selected.project.delivery_chains) {
        const deliveryChains = this.selected.project.delivery_chains;
        deliveryChains.push({ title: 'NEW' });
        return deliveryChains || [];
      }
      return [];
    },
    deliveryChainRoles() {
      return this.$store.state.mmpi.delivery_chain_roles || [];
    },
    instanceTypes() {
      return this.$store.state.mmpi.instanceTypes || [];
    },
    environmentTypes() {
      return this.$store.state.mmpi.environmentTypes || [];
    },
  },
  methods: {
    setUpdateData() {
      this.selected = { ...this.request };

      if (this.request.project) {
        this.selected.project = this.projects
          .find((project) => project.name === this.request.project);
      }

      if (this.request.delivery_chain) {
        this.selected.delivery_chain = this.projectDeliveryChains
          .find((deliveryChain) => deliveryChain.title === this.request.delivery_chain);
      }

      if (this.request.dc_role) {
        this.selected.dc_role = this.deliveryChainRoles
          .find((dcRole) => dcRole.value === this.request.dc_role);
      }

      if (this.request.instance_type) {
        this.selected.instance_type = this.instanceTypes
          .find((instanceType) => instanceType.type === this.request.instance_type);
      }

      if (this.request.environment_type) {
        this.selected.environment_type = this.environmentTypes
          .find((environmentType) => environmentType.title === this.request.environment_type);
      }

      if (this.request.mail !== null) {
        this.selected.mail = this.request.mail === 1
          ? { name: 'Yes', value: 1 } : { name: 'No', value: 0 };
      }

      if (this.request.telephony !== null) {
        this.selected.telephony = this.request.telephony === 1
          ? { name: 'Yes', value: 1 } : { name: 'No', value: 0 };
      }

      if (this.request.fax !== null) {
        this.selected.fax = this.request.fax === 1
          ? { name: 'Yes', value: 1 } : { name: 'No', value: 0 };
      }

      if (this.request.sms !== null) {
        this.selected.sms = this.request.sms === 1
          ? { name: 'Yes', value: 1 } : { name: 'No', value: 0 };
      }

      if (this.request.imagerie !== null) {
        this.selected.imagerie = this.request.imagerie === 1
          ? { name: 'Yes', value: 1 } : { name: 'No', value: 0 };
      }

      if (this.request.archivage !== null) {
        this.selected.archivage = this.request.archivage === 1
          ? { name: 'Yes', value: 1 } : { name: 'No', value: 0 };
      }
    },

    getDefaultDeliveryChainRole() {
      if (this.selected.delivery_chain && this.selected.delivery_chain.dc_role) {
        this.selected.dc_role = { value: this.selected.delivery_chain.dc_role.value };
      }
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const payload = {
        id: this.selected.id,
        project: this.selected.project.name,
        delivery_chain: this.selected.delivery_chain.title,
        dc_role: this.selected.dc_role.value,
        instance_type: this.selected.instance_type.type,
        environment_type: this.selected.environment_type.title,
        comments: this.selected.comments,
      };

      if (this.selected.mail) {
        payload.mail = this.selected.mail.value;
      }

      if (this.selected.telephony) {
        payload.telephony = this.selected.telephony.value;
      }

      if (this.selected.fax) {
        payload.fax = this.selected.fax.value;
      }

      if (this.selected.sms) {
        payload.sms = this.selected.sms.value;
      }

      if (this.selected.imagerie) {
        payload.imagerie = this.selected.imagerie.value;
      }

      if (this.selected.archivage) {
        payload.archivage = this.selected.archivage.value;
      }

      this.$store.dispatch(`esxi/${this.action}RequestedInstance`, payload)
        .then(() => {
          this.$emit('close');
          if (this.action === 'create') {
            this.$M.toast({ html: 'The instance has been requested', classes: 'toast-success' });
            return;
          }
          this.$M.toast({ html: 'The requested instance has been updated', classes: 'toast-success' });
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },

  watch: {
    /* eslint func-names: ["error", "as-needed"] */
    'selected.delivery_chain': function () {
      this.getDefaultDeliveryChainRole();
    },
  },

  mounted() {
    if (this.action === 'update') {
      this.setUpdateData();
    }
  },
};

</script>
