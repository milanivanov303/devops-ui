<template>
  <div>
    <Table v-bind:request="request"
           v-on:selectedRow="selectedRow"/>
    <div id="action" ref="register-demo-modal" class="modal right-sheet">
      <div class="modal-content">
        <h1 class="center flow-text" >Schedule a demo</h1>
        <Alert v-if="getError" v-bind:msg="getError" />
        <div class="row">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <div class="input-field col s12 m7 l7" :class="{invalid: $v.modalData.name.$error}">
                <i class="material-icons prefix">person</i>
                <input
                    type="text"
                    id="name"
                    @blur="$v.modalData.name.$touch()"
                    v-model="modalData.name">
                <label :class="{active: modalData.name}" for="name">Name</label>
              </div>
              <div class="validator col s12 m4 l4 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.modalData.name.$error">
                  <p v-if="!$v.modalData.name.required">Name field must not be empty.</p>
                  <p v-if="!$v.modalData.name.minLen">Name must contain at least 6 charaters.</p>
                </div>
                <div class="green-text" v-if="!$v.modalData.name.$invalid">
                  <p>Name accepted!</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m7 l7" :class="{invalid: $v.modalData.email.$error}">
                <i class="material-icons prefix">mail</i>
                <input
                    type="email"
                    id="email"
                    @blur="$v.modalData.email.$touch()"
                    v-model="modalData.email">
                <label :class="{active: modalData.email}" for="email">Mail</label>
              </div>
              <div class="validator col s12 m4 l4 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.modalData.email.$error">
                  <p v-if="!$v.modalData.email.email">Please provide a valid email address.</p>
                  <p v-if="!$v.modalData.email.required">Email must not be empty.</p>
                </div>
                  <div class="green-text" v-if="!$v.modalData.email.$invalid">
                    <p>Email accepted!</p>
                  </div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m7 l7"
                   :class="{invalid: $v.modalData.company.$error}">
                <i class="material-icons prefix">business</i>
                <input
                    type="text"
                    id="company"
                    @blur="$v.modalData.company.$touch()"
                    v-model="modalData.company">
                <label :class="{active: modalData.company}" for="company">Company</label>
              </div>
              <div class="validator col s12 m4 l4 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.modalData.company.$error">
                  <p v-if="!$v.modalData.company.required">Company field must not be empty.</p>
                </div>
                <div class="green-text" v-if="!$v.modalData.company.$invalid">
                  <p>Company name accepted!</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m7 l7" :class="{invalid: $v.modalData.phone.$error}">
                <i class="material-icons prefix">call</i>
                <input
                    type="text"
                    id="phone"
                    @blur="$v.modalData.phone.$touch()"
                    v-model="modalData.phone">
                <label :class="{active: modalData.phone}" for="phone">Phone</label>
              </div>
              <div class="validator col s12 m4 l4 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.modalData.phone.$error">
                  <p v-if="!$v.modalData.phone.numeric">Phone field must contain only numbers.</p>
                </div>
              </div>
            </div>
            <div class="row">
              <Select class="col s12 m7 l7"
                      v-if="isOpen === true"
                      :select="selectBusiness"
                      @selectedVal="selectedBusiness"/>
              <div class="validator col s12 m4 l4 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.modalData.business.error">
                  <p v-if="!$v.modalData.business.required">Business field must not be empty.</p>
                </div>
                <div class="green-text" v-if="!$v.modalData.business.$invalid">
                  <p>Business accepted!</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m7 l7"
                   :class="{invalid: $v.modalData.active_from.$error}">
                <i class="material-icons prefix">date_range</i>
                  <datetime input-id="activeFrom"
                            input-class="datetime-input"
                            type="datetime"
                            v-model="modalData.active_from"
                            :min-datetime="dateNow"
                            :max-datetime="modalData.active_to"
                            class="datetime-theme"
                            format="yyyy-MM-dd HH:mm:ss"
                            zone="Europe/Sofia"
                            :week-start="1"/>
                <label :class="{active: modalData.active_from}" for="activeFrom">Active from</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m7 l7"
                   :class="{invalid: $v.modalData.active_to.$error}">
                <i class="material-icons prefix">date_range</i>
                  <datetime input-id="activeTo"
                            input-class="datetime-input"
                            type="datetime"
                            v-model="modalData.active_to"
                            class="datetime-theme"
                            format="yyyy-MM-dd HH:mm:ss"
                            zone="Europe/Sofia"
                            :min-datetime="endDateCheck()"
                            :week-start="1"/>
                <label :class="{active: modalData.active_to}" for="activeTo">Active to</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m7 l7">
                <i class="material-icons prefix">mode_edit</i>
                  <textarea id="details"
                            class="materialize-textarea"
                            v-model.trim="modalData.details"></textarea>
                  <label :class="{active: modalData.details}"
                         for="icon_prefix2">Details</label>
              </div>
            </div>
            <div class="row">
              <div class="col s6 m2 l2">
                <label for="status-aproved">
                  <input id="status-aproved"
                         class="with-gap"
                         :disabled="statusCheck"
                         type="radio"
                         value="approved"
                         v-model="modalData.status"
                         :checked="modalData.status === 'approved'" />
                  <span>Approved</span>
                </label>
              </div>
              <div class="col s6 m2 l2">
                <label for="status-rejected">
                  <input id="status-rejected"
                         class="with-gap"
                         :disabled="statusCheck"
                         type="radio"
                         value="rejected"
                         v-model="modalData.status"/>
                  <span>Rejected</span>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m6 l6">
                <button class="btn waves-effect waves-light right"
                        type="submit"
                        name="action"
                        :disabled="$v.$invalid">
                        Submit </button>
              </div>
              <div class="input-field col s12 m6 l6">
                <a href="#!"
                   @click="close"
                   class="modal-close waves-effect waves-blue btn-flat left">Close</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Datetime } from 'vue-datetime';
import { DateTime } from 'luxon';
import {
  required, email, numeric, minLength,
} from 'vuelidate/lib/validators';
import 'vue-datetime/dist/vue-datetime.css';

export default {
  components: {
    datetime: Datetime,
  },
  data() {
    return {
      isOpen: false,
      action: '',
      demoId: '',
      dateNow: DateTime.local().toISO(),
      request: {
        data: 'demo/demos',
        columns: {
          company: '',
          name: '',
          business: '',
          active_from: '',
          active_to: '',
          status: '',
          code: '',
          url: value => this.demoUrl(value),
        },
        add: true,
        export: false,
        action: true,
        searchable: true,
      },
      modalData: {
        name: '',
        email: '',
        phone: '',
        company: '',
        details: '',
        country: 'Bulgaria',
        business: '',
        active_from: '',
        active_to: '',
        status: 'approved',
      },
      selectBusiness: {
        id: 'business_select',
        name: 'business',
        displayed: 'name',
        icon: 'business_center',
        options: {
          dc: {
            name: 'Debt Collection',
          },
          leas: {
            name: 'Factoring',
          },
          fac: {
            name: 'Leasing',
          },
          cf: {
            name: 'Commercial finance',
          },
          conf: {
            name: 'Consumer finance',
          },
          other: {
            name: 'Other',
          },
        },
        label: 'Business area',
        selected: '',
      },
    };
  },
  validations: {
    modalData: {
      name: {
        required,
        minLen: minLength(6),
      },
      email: {
        required,
        email,
      },
      company: {
        required,
      },
      business: {
        required,
      },
      phone: {
        numeric,
      },
      active_from: {
        required,
      },
      active_to: {
        required,
      },
    },
  },
  computed: {
    getError() {
      return this.$store.getters['demo/getError'];
    },
    statusCheck() {
      const statuses = ['requested', 'approved', 'rejected'];
      return !statuses.includes(this.modalData.status);
    },
  },
  methods: {
    selectedBusiness(value) {
      this.$v.modalData.business.$touch();
      this.modalData.business = value.name;
    },
    endDateCheck() {
      const minActiveTo = this.modalData.active_from || this.dateNow;
      return minActiveTo;
    },
    openModal() {
      this.$M.Modal.init(this.$refs['register-demo-modal'], {
        onOpenStart: this.isOpen = true,
        dismissible: false,
        preventScrolling: false,
      }).open();
    },
    close() {
      this.action = '';
      this.isOpen = false;
      this.$M.Modal.init(this.$refs['register-demo-modal']).close();
    },
    selectedRow(value) {
      if (value === 'add_new') {
        this.action = value;
        this.selectBusiness.selected = '';
        this.modalData = {
          name: '',
          email: '',
          phone: '',
          company: '',
          details: '',
          country: 'Bulgaria',
          business: '',
          active_from: DateTime.local().toISO(),
          active_to: DateTime.local().plus({ days: 1 }).toISO(),
          status: 'approved',
        };
        this.openModal();
      }

      const demoDetails = this.$store.getters['demo/demo'](parseInt(value.id, 10))[0];

      if (demoDetails) {
        this.action = 'update';
        this.demoId = demoDetails.id;

        this.modalData.name = demoDetails.name;
        this.modalData.email = demoDetails.email;
        this.modalData.phone = demoDetails.phone;
        this.modalData.company = demoDetails.company;
        this.modalData.details = demoDetails.details;
        this.modalData.country = demoDetails.country;
        this.modalData.business = demoDetails.business;
        this.modalData.active_from = DateTime.fromSQL(demoDetails.active_from).toISO()
          || DateTime.local().toISO();
        this.modalData.active_to = DateTime.fromSQL(demoDetails.active_to).toISO()
          || DateTime.local().plus({ days: 1 }).toISO();
        this.modalData.status = demoDetails.status;

        const business = Object.values(this.selectBusiness.options)
          .filter(val => val.name === demoDetails.business)[0];
        this.selectBusiness.selected = business || this.selectBusiness.options.other;
      }
      this.openModal();
    },
    demoUrl(value) {
      let url;
      if (value) {
        url = `<a target="_blank"
                  title="${value}" 
                  href='${value}'>
                  <i class="material-icons">cast_connected</i>
                </a>`;
      }
      return url;
    },
    onSubmit() {
      const payload = {
        formData: this.modalData,
        action: this.action,
        demoId: this.demoId,
      };

      payload.formData.active_from = DateTime.fromISO(this.modalData.active_from)
        .toFormat('yyyy-MM-dd HH:mm:ss');
      payload.formData.active_to = DateTime.fromISO(this.modalData.active_to)
        .toFormat('yyyy-MM-dd HH:mm:ss');

      this.$store.dispatch('demo/submitDemo', payload);
      this.close();
    },
    async prepareData() {
      const loader = this.$loading.show({ container: this.$el });
      const payload = {
        orders: JSON.stringify({ active_from: 'desc' }),
      };
      await this.$store.dispatch('demo/getDemos', payload).then(() => {
        loader.hide();
      });
      if (this.$route.params.id) {
        this.selectedRow(this.$route.params);
      }
    },
  },
  mounted() {
    this.prepareData();
  },
};
</script>
