<template>
  <div class="col s12 l12">
    <div class="data-table" ref="demos">
      <Table
        :data="demos"
        sort-by="created_on"
        sort-dir="desc"
        @export="exportDemos()"
        :view-btn="false"
        :delete-btn="false"
        @add="openAddEditDemoModal({}, 'create')"
        @edit="(row) => openAddEditDemoModal(row, 'update')"
      >
        <Column show="name"/>
        <Column show="company"/>
        <Column show="business"/>
        <Column
          label="Created on"
          :show="(demo) => $date(demo.created_on).toHuman()"
          sort-by="created_on"
        />
        <Column
          label="Active from"
          :show="(demo) => demo.active_from ? $date(demo.active_from).toHuman() : ''"
          sort-by="active_from"
        />
        <Column
          label="Active to"
          :show="(demo) => demo.active_to ? $date(demo.active_to).toHuman() : ''"
          sort-by="active_to"
        />
        <Column
          label="Self service"
          :show="(demo) => getSelfServiceIcon(demo)"
          sort-by="self_service"
        />
        <Column label="Status" :show="(demo) => getStatusIcon(demo)" sort-by="status"/>
        <Column label="Url" :show="demo => this.getDemoUrl(demo)" :sortable="false"/>
      </Table>
    </div>

    <Modal
      v-if="showAddEditDemoModal"
      @close="closeAddEditDemoModal()"
      class="right-sheet">
      <template v-slot:header>
        <div v-if="action === 'create'">
          Schedule a demo
        </div>
        <div v-else>
          Update {{demo.name}}
        </div>
      </template>
      <template v-slot:content>
        <form class=" col s12 l11">
          <div class="row">
            <div class="input-field col s12" :class="{invalid: $v.demo.name.$error}">
              <i class="material-icons prefix">person</i>
              <input
                type="text"
                id="name"
                @blur="$v.demo.name.$touch()"
                v-model="demo.name">
              <label :class="{active: demo.name}" for="name">Name*</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.demo.name.$error">
                <p v-if="!$v.demo.name.required">Name field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 " :class="{invalid: $v.demo.email.$error}">
              <i class="material-icons prefix">mail</i>
              <input
                type="email"
                id="email"
                @blur="$v.demo.email.$touch()"
                v-model="demo.email">
              <label :class="{active: demo.email}"
                     for="email">Mail*
              </label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.demo.email.$error">
                <p v-if="!$v.demo.email.email">Please provide a valid email address.</p>
                <p v-if="!$v.demo.email.required">Email must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12"
                 :class="{invalid: $v.demo.company.$error}">
              <i class="material-icons prefix">business</i>
              <input
                type="text"
                id="company"
                @blur="$v.demo.company.$touch()"
                v-model="demo.company">
              <label :class="{active: demo.company}"
                     for="company">Company*
              </label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.demo.company.$error">
                <p v-if="!$v.demo.company.required">Company field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12" :class="{invalid: $v.demo.phone.$error}">
              <i class="material-icons prefix">call</i>
              <input
                type="text"
                id="phone"
                @blur="$v.demo.phone.$touch()"
                v-model="demo.phone">
              <label :class="{active: demo.phone}" for="phone">Phone</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.demo.phone.$error">
                <p v-if="!$v.demo.phone.numeric">Phone field must contain only numbers.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <Select
              class="col s12"
              label="Business area*"
              icon="business_center"
              displayed="name"
              v-model="demo.business"
              :options="businesses"
            />
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6"
                 :class="{invalid: $v.demo.active_from.$error}">
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="active_from"
                        input-class="datetime-input"
                        type="datetime"
                        v-model="demo.active_from"
                        :min-datetime="dateNow"
                        class="datetime-theme"
                        :format="$date.format"
                        :week-start="1"/>
              <label :class="{active: demo.active_from}"
                     for="active_from">Active from*
              </label>
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.demo.active_from.$error">
                  <p v-if="!$v.demo.active_from.required">
                    Active from field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="input-field col s12 m6 l6"
              :class="{invalid: $v.demo.active_to.$error}"
              >
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="active_to"
                        input-class="datetime-input"
                        type="datetime"
                        v-model="demo.active_to"
                        class="datetime-theme"
                        :format="$date.format"
                        :min-datetime="endDateCheck()"
                        :week-start="1"/>
              <label :class="{active: demo.active_to}"
                     for="active_to">Active to*
              </label>
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.demo.active_to.$error">
                  <p v-if="!$v.demo.active_to.required">
                    Active to field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 disabled">
              <i class="material-icons prefix">mode_edit</i>
              <textarea
                id="details"
                class="materialize-textarea"
                v-model.trim="demo.details"
              ></textarea>
              <label :class="{active: demo.details}"
                     for="details">Details</label>
            </div>
          </div>
          <div class="row" v-if="allowStatusChange()">
            <Select
              class="col s12"
              label="Status*"
              icon="timelapse"
              displayed="name"
              v-model="demo.status"
              :options="statuses"
            />
          </div>
          <div class="row">
            <div class="col s12">
              <label>
                <input type="checkbox" v-model="demo.self_service"/>
                <span>Self service</span>
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
          @click="save()"
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
  required, email, numeric,
} from 'vuelidate/lib/validators';
import 'vue-datetime/dist/vue-datetime.css';

export default {
  components: {
    datetime: Datetime,
  },

  data() {
    return {
      showAddEditDemoModal: false,
      dateNow: DateTime.local().toISO(),
      action: '',
      demo: {},
      businesses: [
        {
          name: 'Commercial finance',
        },
        {
          name: 'Debt Collection',
        },
        {
          name: 'Leasing',
        },
        {
          name: 'Factoring',
        },
        {
          name: 'Consumer finance',
        },
        {
          name: 'Other',
        },
      ],
      statuses: [
        {
          name: 'Approved',
          value: 'approved',
        },
        {
          name: 'Rejected',
          value: 'rejected',
        },
        {
          name: 'Requested',
          value: 'requested',
        },
      ],
    };
  },
  validations() {
    const validations = {
      demo: {
        name: {
          required,
        },
        email: {
          required,
          email,
        },
        company: {
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
    };

    if (this.demo.status && this.demo.status.value === 'rejected') {
      validations.demo.active_from = {};
      validations.demo.active_to = {};
    }

    return validations;
  },
  computed: {
    demos() {
      return this.$store.state.demo.demos;
    },
  },
  methods: {
    getSelfServiceIcon(demo) {
      if (demo.self_service) {
        return '<i class="material-icons green-text">check</i>';
      }

      return '<i class="material-icons red-text">clear</i>';
    },

    getStatusIcon(demo) {
      if (demo.status === 'active') {
        return `<span class="new badge green" data-badge-caption="">${demo.status}</span>`;
      }

      if (demo.status === 'rejected' || demo.status === 'failed') {
        return `<span class="new badge red" data-badge-caption="">${demo.status}</span>`;
      }

      if (demo.status === 'approved') {
        return `<span class="new badge blue" data-badge-caption="">${demo.status}</span>`;
      }
      return `<span class="new badge" data-badge-caption="">${demo.status}</span>`;
    },

    openAddEditDemoModal(demo, action) {
      this.$v.$reset();

      this.demo = {

        country: 'Bulgaria',
        business: 'Factoring',
        status: 'approved',
        ...demo,
      };

      if (this.demo.business) {
        this.demo.business = this.businesses.find(
          (business) => business.name === this.demo.business,
        );
      }

      if (this.demo.status) {
        this.demo.status = this.statuses.find(
          (status) => status.value === this.demo.status,
        );
      }

      if (this.demo.active_from) {
        this.demo.active_from = this.$date(this.demo.active_from).toISO();
      }

      if (this.demo.active_to) {
        this.demo.active_to = this.$date(this.demo.active_to).toISO();
      }

      this.$router.push({
        path: `/demos/list/${encodeURIComponent(this.demo.id || 'new')}`,
      });

      this.showAddEditDemoModal = true;
      this.action = action;
    },

    closeAddEditDemoModal() {
      this.showAddEditDemoModal = false;
      this.$router.push({
        path: '/demos/list',
      });
    },

    allowStatusChange() {
      if (this.demo.status) {
        if (this.demo.status.value === 'requested') {
          return true;
        }

        if (this.demo.status.value === 'approved') {
          return true;
        }

        if (this.demo.status.value === 'rejected') {
          return true;
        }
      }

      return false;
    },

    endDateCheck() {
      return this.demo.active_from || this.dateNow;
    },

    close() {
      this.showAddEditDemoModal = false;
    },

    getDemoUrl(demo) {
      if (demo.status === 'active' && demo.url) {
        return `<a target="_blank" title="${demo.url}" href='${demo.url}'>
                  <i class="material-icons">cast_connected</i>
                </a>`;
      }

      return '';
    },

    getDemos() {
      const loader = this.$loading.show({ container: this.$refs.demos });

      this.$store.dispatch('demo/getDemos')
        .then(() => {
          loader.hide();
          if (this.$route.params.id) {
            if (this.$route.params.id === 'new') {
              return this.openAddEditDemoModal({}, 'create');
            }

            const demo = this.$store.state.demo.demos.find((demo) => {
              if (demo.id === parseInt(this.$route.params.id, 10)) {
                return true;
              }
              return false;
            });

            if (demo) {
              return this.openAddEditDemoModal(demo, 'update');
            }

            this.$M.toast({ html: 'This demo does not exist!', classes: 'toast-fail' });
          }
          return false;
        });
    },

    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = { ...this.demo };
      payload.active_from = this.$date(this.demo.active_from).toSeconds();
      payload.active_to = this.$date(this.demo.active_to).toSeconds();
      payload.business = payload.business.name;

      if (payload.status) {
        payload.status = payload.status.value;
      }

      if (!this.allowStatusChange()) {
        delete payload.status;
      }
      delete payload.code;

      this.$store.dispatch(`demo/${this.action}Demo`, payload)
        .then(() => {
          this.showAddEditDemoModal = false;
          if (this.action === 'create') {
            this.$M.toast({ html: 'The demo has been created!', classes: 'toast-seccess' });
            return;
          }
          this.$M.toast({ html: `The demo has been ${payload.status}!`, classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
        });
    },

    // Export all Demos in Exsel file
    exportDemos() {
      this.$store.dispatch('demo/getDemosExport');
    },
  },
  mounted() {
    this.getDemos();
  },
};
</script>
