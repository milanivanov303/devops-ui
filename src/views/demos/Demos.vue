<template>
  <div class="col s12 l12">
    <div class="data-table" ref="demos">
      <Table
        :data="demos"
        sort-by="name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :delete-btn="false"
        @add="openAddEditDemoModal({}, 'create')"
        @edit="(row) => openAddEditDemoModal(row, 'update')"
      >
        <Column show="company"/>
        <Column show="name"/>
        <Column show="business"/>
        <Column show="active_from"/>
        <Column show="active_to"/>
        <Column show="status"/>
        <Column show="code"/>
        <Column label="Url" :show="url => this.demoUrl(url)"/>
      </Table>
    </div>

    <Modal
      v-if="showAddEditDemoModal"
      @close="closeAddEditDemoModal()"
      @opened="isOpen = true"
      class="right-sheet">
      <template v-slot:header>
        <div v-if="action === 'create'">
          Schedule a demo
        </div>
        <div v-else>
          Update {{selectedDemo.name}}
        </div>
      </template>
      <template v-slot:content>
        <form class=" col s12 l11">
          <div class="row">
            <div class="input-field col s12" :class="{invalid: $v.selectedDemo.name.$error}">
              <i class="material-icons prefix">person</i>
              <input
                type="text"
                id="name"
                @blur="$v.selectedDemo.name.$touch()"
                v-model="selectedDemo.name">
              <label :class="{active: selectedDemo.name}" for="name">Name*</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.selectedDemo.name.$error">
                <p v-if="!$v.selectedDemo.name.required">Name field must not be empty.</p>
                <p v-if="!$v.selectedDemo.name.minLen">Name must contain at least 6 charaters.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 " :class="{invalid: $v.selectedDemo.email.$error}">
              <i class="material-icons prefix">mail</i>
              <input
                type="email"
                id="email"
                @blur="$v.selectedDemo.email.$touch()"
                v-model="selectedDemo.email">
              <label :class="{active: selectedDemo.email}"
                     for="email">Mail*
              </label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.selectedDemo.email.$error">
                <p v-if="!$v.selectedDemo.email.email">Please provide a valid email address.</p>
                <p v-if="!$v.selectedDemo.email.required">Email must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12"
                 :class="{invalid: $v.selectedDemo.company.$error}">
              <i class="material-icons prefix">business</i>
              <input
                type="text"
                id="company"
                @blur="$v.selectedDemo.company.$touch()"
                v-model="selectedDemo.company">
              <label :class="{active: selectedDemo.company}"
                     for="company">Company*
              </label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.selectedDemo.company.$error">
                <p v-if="!$v.selectedDemo.company.required">Company field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12" :class="{invalid: $v.selectedDemo.phone.$error}">
              <i class="material-icons prefix">call</i>
              <input
                type="text"
                id="phone"
                @blur="$v.selectedDemo.phone.$touch()"
                v-model="selectedDemo.phone">
              <label :class="{active: selectedDemo.phone}" for="phone">Phone</label>
            </div>
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.selectedDemo.phone.$error">
                <p v-if="!$v.selectedDemo.phone.numeric">Phone field must contain only numbers.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <Select id="select-business"
                    class="col s12"
                    v-if="isOpen === true"
                    :select="selectBusiness"
                    @selectedVal="selectedBusiness"
                    />
            <div class="validator col s12 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.selectedDemo.business.error">
                <p v-if="!$v.selectedDemo.business.required">Business field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6"
                 :class="{invalid: $v.selectedDemo.active_from.$error}">
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="activeFrom"
                        input-class="datetime-input"
                        type="datetime"
                        v-model="selectedDemo.active_from"
                        :min-datetime="dateNow"
                        :max-datetime="selectedDemo.active_to"
                        class="datetime-theme"
                        format="yyyy-MM-dd HH:mm:ss"
                        zone="Europe/Sofia"
                        :week-start="1"/>
              <label :class="{active: selectedDemo.active_from}"
                     for="activeFrom">Active from*
              </label>
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.selectedDemo.active_from.$error">
                  <p v-if="!$v.selectedDemo.active_from.required">
                    Active from field must not be empty.
                  </p>
                </div>
              </div>
            </div>
            <div
              class="input-field col s12 m6 l6"
              :class="{invalid: $v.selectedDemo.active_to.$error}"
              >
              <i class="material-icons prefix">date_range</i>
              <datetime input-id="activeTo"
                        input-class="datetime-input"
                        type="datetime"
                        v-model="selectedDemo.active_to"
                        class="datetime-theme"
                        format="yyyy-MM-dd HH:mm:ss"
                        zone="Europe/Sofia"
                        :min-datetime="endDateCheck()"
                        :week-start="1"/>
              <label :class="{active: selectedDemo.active_to}"
                     for="activeTo">Active to*
              </label>
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.selectedDemo.active_to.$error">
                  <p v-if="!$v.selectedDemo.active_to.required">
                    Active to field must not be empty.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 disabled">
              <i class="material-icons prefix">mode_edit</i>
              <textarea id="details"
                        class="materialize-textarea"
                        v-model.trim="selectedDemo.details"></textarea>
              <label :class="{active: selectedDemo.details}"
                     for="icon_prefix2">Details</label>
            </div>
          </div>
          <div class="row"
               v-if="selectedDemo.status === 'requested' ||
               selectedDemo.status === 'approved' ||
               selectedDemo.status === 'rejected'">
              <Select id="select-status"
                      class="col s12"
                      :select="selectStatus"
                      @selectedVal="selectedStatus"/>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <button
          class="btn waves-effect waves-light"
          type="submit"
          name="action"
            @click="action === 'create' ? createDemo() : updateDemo()"
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
import 'vue-datetime/dist/vue-datetime.css';
import { Table, Column } from '@/components/table';

export default {
  components: {
    datetime: Datetime,
    Table,
    Column,
  },

  data() {
    return {
      showAddEditDemoModal: false,
      isOpen: false,
      demoId: '',
      dateNow: DateTime.local().toISO(),
      action: '',
      selectedDemo: {},
      selectBusiness: {
        id: 'business_select',
        name: 'business',
        displayed: 'name',
        icon: 'business_center',
        options: [
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
        label: 'Business area*',
        selected: {},
      },
      selectStatus: {
        id: 'status_select',
        name: 'status',
        displayed: 'name',
        icon: 'timelapse',
        options: [
          {
            name: 'Approved',
            value: 'approved',
          },
          {
            name: 'Rejected',
            value: 'rejected',
          },
        ],
        label: 'Status',
        selected: {},
      },
    };
  },
  validations: {
    selectedDemo: {
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
    statusCheck() {
      const statuses = ['requested', 'approved', 'rejected'];
      return !statuses.includes(this.selectedDemo.status);
    },
    demos() {
      return this.$store.state.demo.demos;
    },
  },
  methods: {
    openAddEditDemoModal(demo, action) {
      this.showAddEditDemoModal = true;
      this.action = action;
      this.selectedDemo = Object.assign({}, { country: 'Bulgaria' }, { status: 'approved' }, demo);
      this.selectBusiness.selected = { name: this.selectedDemo.business };
      if (action === 'update') {
        this.selectedDemo.active_from = DateTime.fromSQL(this.selectedDemo.active_from)
          .toISO();
        this.selectedDemo.active_to = DateTime.fromSQL(this.selectedDemo.active_to)
          .toISO();
      }
      const status = this.selectStatus.options
        .find(status => status.value === this.selectedDemo.status);
      if (status) {
        this.selectStatus.selected = { name: status.name, value: status.value };
      }
      if (this.selectedDemo.id) {
        this.$router.push({
          path: `/demos/list/${encodeURIComponent(this.selectedDemo.id)}`,
        });
      } else {
        this.$router.push({
          path: '/demos/list/new',
        });
      }
    },

    closeAddEditDemoModal() {
      this.showAddEditDemoModal = false;
      this.$v.$reset();
      this.$router.push({
        path: '/demos/list',
      });
    },

    selectedBusiness(value) {
      this.$v.selectedDemo.business.$touch();
      this.selectedDemo.business = value.name;
    },
    selectedStatus(value) {
      this.selectedDemo.status = value.value;
    },
    endDateCheck() {
      const minActiveTo = this.selectedDemo.active_from || this.dateNow;
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
                  title="${value.url}"
                  href='${value.url}'>
                  <i class="material-icons">cast_connected</i>
                </a>`;
      }
      return url;
    },
    async getDemos() {
      const loader = this.$loading.show({ container: this.$refs.demos });
      const payload = {
        orders: JSON.stringify({ id: 'desc' }),
      };
      await this.$store.dispatch('demo/getDemos', payload).then(() => {
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
            return this.openAddEditDemoModal(demo);
          }
          this.$M.toast({ html: 'This demo does not exist!', classes: 'toast-fail' });
        }
        return false;
      });
    },
    createDemo() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const payload = {
        formData: this.selectedDemo,
        action: this.action,
        demoId: this.demoId,
      };
      payload.formData.active_from = DateTime.fromISO(this.selectedDemo.active_from)
        .toFormat('yyyy-MM-dd HH:mm:ss');
      payload.formData.active_to = DateTime.fromISO(this.selectedDemo.active_to)
        .toFormat('yyyy-MM-dd HH:mm:ss');

      this.$store.dispatch('demo/createDemo', payload)
        .then(() => {
          this.showAddEditDemoModal = false;
          this.$M.toast({ html: 'The demo has been created!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
    },
    updateDemo() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const { id } = this.selectedDemo;
      const payload = this.selectedDemo;
      delete payload.id;
      delete payload.code;

      payload.active_from = DateTime.fromISO(this.selectedDemo.active_from)
        .toFormat('yyyy-MM-dd HH:mm:ss');
      payload.active_to = DateTime.fromISO(this.selectedDemo.active_to)
        .toFormat('yyyy-MM-dd HH:mm:ss');

      this.$store.dispatch('demo/updateDemo', { id, payload })
        .then(() => {
          this.showAddEditDemoModal = false;
          this.$M.toast({ html: 'The demo has been updated!', classes: 'toast-seccess' });
        })
        .catch((error) => {
          this.error = error;
          return error;
        });
    },
  },
  mounted() {
    this.getDemos();
  },
};
</script>