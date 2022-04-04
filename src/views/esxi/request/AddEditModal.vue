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
                  :items="deliveryChains"
                  v-model="selected.delivery_chain"
                  :invalid="$v.selected.delivery_chain.$error"
                  @blur="$v.selected.delivery_chain.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.delivery_chain.$error">
                  <p v-if="!$v.selected.delivery_chain.required">Delivery chain field must not be empty.</p>
                </div>
              </div>
            </div>
            <div class="col s12 m6">
              <Autocomplete
                  label="Type"
                  :items="deliveryChainsTypes"
                  v-model="selected.delivery_chain_type"
                  :invalid="$v.selected.delivery_chain_type.$error"
                  @blur="$v.selected.delivery_chain_type.$touch()"
              />
              <div class="validator">
                <div class="red-text" v-if="$v.selected.delivery_chain.$error">
                  <p v-if="!$v.selected.delivery_chain.required">Delivery chain type field must not be empty.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <Autocomplete
                class="col s12"
                label="Instance type"
                :items="instanceTypes"
                v-model="selected.instance_type"
                :invalid="$v.selected.instance_type.$error"
                @blur="$v.selected.instance_type.$touch()"
            />
            <div class="validator col s12">
              <div class="red-text" v-if="$v.selected.instance_type.$error">
                <p v-if="!$v.selected.instance_type.required">Instance type field must not be empty.</p>
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
        </form>
      </template>
      <template v-slot:footer>
        <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="save()"
        >
          Request
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
      delivery_chain_type: {
        required,
      },
      instance_type: {
        required,
      },
    }
  },
  computed: {
    projects() {
      return this.$store.state.mmpi.projects;
    },
    deliveryChains() {
      if (this.selected.project && this.selected.project.delivery_chains) {
        this.selected.project.delivery_chains.push({ title: 'NEW' })
        return this.selected.project.delivery_chains || [];
      }
      return [];
    },
    deliveryChainsTypes() {
      return [
        {
          name: 'Validation',
        },
        {
          name: 'HotFix',
        },
        {
          name: 'MajorRelease',
        },
        {
          name: 'MinorRelease',
        },
      ];
    },
    instanceTypes() {
      //check with mmpi
      return [
        {
          name: 'Intranet',
        },
        {
          name: 'Extranet',
        },
        {
          name: 'AD',
        },
      ];
    },
  },
  methods: {
    getDefaultDeliveryChainType() {
      this.selected.delivery_chain_type = null;
      if (this.selected.delivery_chain && this.selected.delivery_chain.dc_role) {
        this.selected.delivery_chain_type = { name: this.selected.delivery_chain.dc_role.value };
      }
    },
    setUpdateData() {
      this.selected = { ...this.request };

      if (this.request.project) {
        this.selected.project = this.projects
            .find((project) => project.name === this.request.project);
      }

      if (this.request.delivery_chain) {
        this.selected.delivery_chain = this.deliveryChains
            .find((deliveryChain) => deliveryChain.title === this.request.delivery_chain);
      }

      if (this.request.delivery_chain_type) {
        this.selected.delivery_chain_type = this.deliveryChainsTypes
            .find((deliveryChainsType) => deliveryChainsType.name === this.request.delivery_chain_type);
      }

      if (this.request.instance_type) {
        this.selected.instance_type = this.instanceTypes
            .find((instanceType) => instanceType.name === this.request.instance_type);
      }
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.$store.dispatch(`esxi/${this.action}RequestedInstance`, {
        id: this.selected.id,
        project: this.selected.project.name,
        delivery_chain: this.selected.delivery_chain.title,
        delivery_chain_type: this.selected.delivery_chain_type.name,
        instance_type: this.selected.instance_type.name,
        comments: this.selected.comments
      })
        .then(() => {
          this.$emit('close');
          if (this.action === 'create') {
            this.$M.toast({ html: 'The instance has been requested', classes: 'toast-seccess' });
            return;
          }
          this.$M.toast({ html: 'The requested instance has been updated', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },

  watch: {
    /* eslint func-names: ["error", "as-needed"] */
    'selected.delivery_chain': function () {
      this.getDefaultDeliveryChainType();
    },
  },

  beforeCreate() {
    this.$store.dispatch('mmpi/getProjects')
      .then(() => {
        if (this.action === 'update') this.setUpdateData();
      });
  }
};

</script>
