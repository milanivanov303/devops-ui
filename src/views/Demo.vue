<template>
  <div class="col s12 l12">
    <div class="data-table">
     <Table v-bind:request="request"  @add="createNew({})">
          <template v-slot:buttons="{ data }">
            <a @click="selectData(data)"><i class="material-icons right">attachment</i></a>
          </template>
        </Table>
    </div>

    <Modal v-if="showModal" @close="showModal = false" class="right-sheet">
      <template v-slot:header>Schedule a demo</template>
      <template v-slot:content>
        <form class=" col s12 l10 offset-l1">
          <div class="row">
            <div class="input-field col s12" :class="{invalid: $v.currentDemo.name.$error}">
              <i class="material-icons prefix">person</i>
              <input
                type="text"
                id="name"
                @blur="$v.currentDemo.name.$touch()"
                v-model="currentDemo.name">
              <label :class="{active: currentDemo.name}" for="name">Name</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.currentDemo.name.$error">
                <p v-if="!$v.currentDemo.name.required">Name field must not be empty.</p>
                <p v-if="!$v.currentDemo.name.minLen">Name must contain at least 6 charaters.</p>
              </div>
              <div class="green-text" v-if="!$v.currentDemo.name.$invalid">
                <p>Name accepted!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 " :class="{invalid: $v.currentDemo.email.$error}">
              <i class="material-icons prefix">mail</i>
              <input
                type="email"
                id="email"
                @blur="$v.currentDemo.email.$touch()"
                v-model="currentDemo.email">
              <label :class="{active: currentDemo.email}" for="email">Mail</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.currentDemo.email.$error">
                <p v-if="!$v.currentDemo.email.email">Please provide a valid email address.</p>
                <p v-if="!$v.currentDemo.email.required">Email must not be empty.</p>
              </div>
              <div class="green-text" v-if="!$v.currentDemo.email.$invalid">
                <p>Email accepted!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12"
                 :class="{invalid: $v.currentDemo.company.$error}">
              <i class="material-icons prefix">business</i>
              <input
                type="text"
                id="company"
                @blur="$v.currentDemo.company.$touch()"
                v-model="currentDemo.company">
              <label :class="{active: currentDemo.company}" for="company">Company</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.currentDemo.company.$error">
                <p v-if="!$v.currentDemo.company.required">Company field must not be empty.</p>
              </div>
              <div class="green-text" v-if="!$v.currentDemo.company.$invalid">
                <p>Company name accepted!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12" :class="{invalid: $v.currentDemo.phone.$error}">
              <i class="material-icons prefix">call</i>
              <input
                type="text"
                id="phone"
                @blur="$v.currentDemo.phone.$touch()"
                v-model="currentDemo.phone">
              <label :class="{active: currentDemo.phone}" for="phone">Phone (optional)</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.currentDemo.phone.$error">
                <p v-if="!$v.currentDemo.phone.numeric">Phone field must contain only numbers.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <Select class="col s12"
                    v-if="isOpen === true"
                    :select="selectBusiness"
                    @selectedVal="selectedBusiness"/>
            <div class="validator col s12 m7 l4 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.currentDemo.business.error">
                <p v-if="!$v.currentDemo.business.required">Business field must not be empty.</p>
              </div>
              <div class="green-text" v-if="!$v.currentDemo.business.$invalid">
                <p>Business accepted!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6"
                 :class="{invalid: $v.currentDemo.active_from.$error}">
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="activeFrom"
                        input-class="datetime-input"
                        type="datetime"
                        v-model="currentDemo.active_from"
                        :min-datetime="dateNow"
                        :max-datetime="currentDemo.active_to"
                        class="datetime-theme"
                        format="yyyy-MM-dd HH:mm:ss"
                        zone="Europe/Sofia"
                        :week-start="1"/>
              <label :class="{active: currentDemo.active_from}" for="activeFrom">Active from</label>
            </div>
            <div class="input-field col s12 m6 l6"
                 :class="{invalid: $v.currentDemo.active_to.$error}">
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="activeTo"
                        input-class="datetime-input"
                        type="datetime"
                        v-model="currentDemo.active_to"
                        class="datetime-theme"
                        format="yyyy-MM-dd HH:mm:ss"
                        zone="Europe/Sofia"
                        :min-datetime="endDateCheck()"
                        :week-start="1"/>
              <label :class="{active: currentDemo.active_to}" for="activeTo">Active to</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">mode_edit</i>
              <textarea id="details"
                        class="materialize-textarea"
                        v-model.trim="currentDemo.details"></textarea>
              <label :class="{active: currentDemo.details}"
                     for="icon_prefix2">Details (optional)</label>
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
                       v-model="currentDemo.status"
                       :checked="currentDemo.status === 'approved'" />
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
                       v-model="currentDemo.status"/>
                <span>Rejected</span>
              </label>
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
          @click="submit()"
        >
          Save
        </button>
      </template>
    </Modal>

  </div>
</template>
<script>

import { Datetime } from 'vue-datetime';
import { DateTime } from 'luxon';
import {
  required, email, numeric, minLength,
} from 'vuelidate/lib/validators';
import Modal from '@/components/partials/Modal';
import 'vue-datetime/dist/vue-datetime.css';
import Table from '@/components/partials/Table';

export default {
  components: {
    Table,
    Modal,
    datetime: Datetime,
  },
  data() {
    return {
      showModal: false,
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
        export: true,
        action: true,
        searchable: true,
      },
      currentDemo: {
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
          cfc: {
            name: 'Commercial Finance - Classical',
          },
          cfr: {
            name: 'Commercial Finance - Reverse',
          },
        },
        label: 'Business area',
        selected: '',
      },
    };
  },
  validations: {
    currentDemo: {
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
    // getError() {
    //   return this.$store.getters['demo/getError'];
    // },
    statusCheck() {
      const statuses = ['requested', 'approved', 'rejected'];
      return !statuses.includes(this.currentDemo.status);
    },
  },
  methods: {
    createNew(demo) {
      this.showModal = true;
      this.currentDemo = {
        name: '',
        email: '',
        phone: '',
        company: '',
        details: '',
        country: 'Bulgaria',
        business: '',
        status: 'approved',
      };
    },
    selectData(demo) {
      this.showModal = true;
      this.currentDemo = demo;
      this.currentDemo.active_from = DateTime.fromSQL(demo.active_from).toISO()
        || DateTime.local().toISO();
      this.currentDemo.active_to = DateTime.fromSQL(demo.active_to).toISO()
        || DateTime.local().plus({ days: 1 }).toISO();
      this.currentDemo.status = demo.status;
    },
    selectedBusiness(value) {
      this.$v.currentDemo.business.$touch();
      this.currentDemo.business = value.name;
    },
    endDateCheck() {
      const minActiveTo = this.currentDemo.active_from || this.dateNow;
      return minActiveTo;
    },
    close() {
      this.action = '';
      this.isOpen = false;
      this.$M.Modal.init(this.$refs['register-demo-modal']).close();
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
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const payload = {
        formData: this.currentDemo,
        action: this.action,
        demoId: this.demoId,
      };
      payload.formData.active_from = DateTime.fromISO(this.currentDemo.active_from)
        .toFormat('yyyy-MM-dd HH:mm:ss');
      payload.formData.active_to = DateTime.fromISO(this.modalData.active_to)
        .toFormat('yyyy-MM-dd HH:mm:ss');

      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$store.dispatch('demo/submitDemo', payload);
      this.close();
    },
    async prepareData() {
      const loader = this.$loading.show({ container: this.$el });
      const payload = {
        orders: JSON.stringify({ id: 'desc' }),
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
