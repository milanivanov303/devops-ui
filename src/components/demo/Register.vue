<template>
  <div>
    <h1 class="center flow-text" >Schedule a demo</h1>
    <alert v-if="getError" v-bind:msg="getError" />
      <div class="row">
        <form @submit.prevent="onSubmit">
          <div class="row">
            <div class="input-field col s12 m6 l6" :class="{invalid: $v.name.$error}">
              <i class="material-icons prefix">person</i>
              <input
                  type="text"
                  id="name"
                  @blur="$v.name.$touch()"
                  v-model="name">
              <label :class="{active: name}" for="name">Name</label>
            </div>
            <div class="validator col s12 m5 l5 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.name.$error">
                <p v-if="!$v.name.required">Name field must not be empty.</p>
                <p v-if="!$v.name.minLen">Name must contain at least 6 charaters.</p>
              </div>
              <div class="green-text" v-if="!$v.name.$invalid">
                <p>Name accepted!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6" :class="{invalid: $v.email.$error}">
              <i class="material-icons prefix">mail</i>
              <input
                  type="email"
                  id="email"
                  @blur="$v.email.$touch()"
                  v-model="email">
              <label :class="{active: email}" for="email">Mail</label>
            </div>
            <div class="validator col s12 m5 l5 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.email.$error">
                <p v-if="!$v.email.email">Please provide a valid email address.</p>
                <p v-if="!$v.email.required">Email must not be empty.</p>
              </div>
                <div class="green-text" v-if="!$v.email.$invalid">
                  <p>Email accepted!</p>
                </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6" :class="{invalid: $v.company.$error}">
              <i class="material-icons prefix">business</i>
              <input
                  type="text"
                  id="company"
                  @blur="$v.company.$touch()"
                  v-model="company">
              <label :class="{active: company}" for="company">Company</label>
            </div>
            <div class="validator col s12 m5 l5 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.company.$error">
                <p v-if="!$v.company.required">Company field must not be empty.</p>
              </div>
              <div class="green-text" v-if="!$v.company.$invalid">
                <p>Company name accepted!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6" :class="{invalid: $v.phone.$error}">
              <i class="material-icons prefix">call</i>
              <input
                  type="text"
                  id="phone"
                  @blur="$v.phone.$touch()"
                  v-model="phone">
              <label :class="{active: phone}" for="phone">Phone</label>
            </div>
            <div class="validator col s12 m5 l5 offset-l1 offset-m1">
              <div class="red-text" v-if="$v.phone.$error">
                <p v-if="!$v.phone.numeric">Phone field must contain only numbers.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <business-select class="col s12 m6 l6"
                              v-bind:select="selectBusiness"
                              v-on:selectedVal="selectedBusiness"/>
            <div class="validator col s12 m5 l5 offset-l1 offset-m1">
              <div class="red-text" v-if="!$v.business.required">
                <p>Business field must not be empty.</p>
              </div>
              <div class="green-text" v-if="!$v.business.$invalid">
                <p>Business accepted!</p>
              </div>
            </div>
          </div>
          <div class="row">
            <date-range class="col s12 m6 l6"
                        v-on:startDatePick="selectedStartDate"
                        v-on:endDatePick="selectedEndDate"/>
            <div class="validator col s12 m5 l5 offset-l1 offset-m1">
              <div class="red-text" v-if="!$v.startDate.required || !$v.endDate.required">
                <p v-if="!$v.startDate.required">Start date field must not be empty.</p>
                <p v-if="!$v.endDate.required">End date field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <time-range class="col s12 m6 l6"
                        v-on:startTimePick="selectedStartTime"
                        v-on:endTimePick="selectedEndTime"/>
            <div class="validator col s12 m5 l5 offset-l1 offset-m1">
              <div class="red-text" v-if="!$v.startTime.required || !$v.endTime.required">
                <p v-if="!$v.startTime.required">Start time field must not be empty.</p>
                <p v-if="!$v.endTime.required">End time field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <i class="material-icons prefix">mode_edit</i>
                <textarea id="details"
                          class="materialize-textarea"
                          v-model="details"></textarea>
                <label for="icon_prefix2">Details</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <button class="btn waves-effect waves-light right"
                      type="submit"
                      name="action">
                      Submit </button>
            </div>
          </div>
        </form>
    </div>
  </div>
</template>

<script>
import {
  required, email, numeric, minLength,
} from 'vuelidate/lib/validators';
import queryString from 'query-string';
import SelectBusiness from '@/components/partials/Select';
import DateRange from '@/components/partials/DateRange';
import TimeRange from '@/components/partials/Timepicker';
import Alert from '@/components/partials/Alert';

export default {
  data() {
    return {
      name: '',
      email: '',
      company: '',
      phone: '',
      business: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      details: '',
      status: 'requested',
      selectBusiness: {
        id: 'business_select',
        name: 'business',
        icon: 'business_center',
        options: {
          dc: {
            name: 'Debt Collection',
          },
          leasing: {
            name: 'Leasing',
          },
          cf: {
            name: 'Commercial Finance',
          },
          other: {
            name: 'Other',
          },
        },
        label: 'Business area',
      },
    };
  },
  components: {
    'business-select': SelectBusiness,
    'date-range': DateRange,
    'time-range': TimeRange,
    alert: Alert,
  },
  computed: {
    getError() {
      return this.$store.getters['demo/getError'];
    },
  },
  validations: {
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
    startDate: {
      required,
    },
    endDate: {
      required,
    },
    startTime: {
      required,
    },
    endTime: {
      required,
    },
  },
  methods: {
    selectedBusiness(value) {
      this.$v.business.$touch();
      this.business = value.name;
    },
    selectedStartDate(value) {
      this.$v.startDate.$touch();
      this.startDate = value;
    },
    selectedEndDate(value) {
      this.$v.endDate.$touch();
      this.endDate = value;
    },
    selectedStartTime(value) {
      this.$v.startTime.$touch();
      this.startTime = value;
    },
    selectedEndTime(value) {
      this.$v.endTime.$touch();
      this.endTime = value;
    },
    onSubmit() {
      const payload = {
        name: this.name,
        email: this.email,
        company: this.company,
        business: this.business,
        // start: `${this.startDate} ${this.startTime}`,
        // end: `${this.endDate} ${this.endTime}`,
        country: 'bulgaria',
        phone: this.phone,
        additional_details: this.details,
        status: this.status,
      };
      this.$store.dispatch('demo/submitRequest', payload);
    },
    prefillForm() {
      // ?name=Tzetzo+Dimi&mail=tzeco@cso.bg&company=codix&phone=123125412&business=Leasing
      const data = queryString.parse(window.location.search);
      if (data) {
        this.name = data.name;
        this.email = data.email;
        this.company = data.company;
        this.phone = data.phone;
        this.business = data.business;

        const businessTypes = Object.values(this.selectBusiness.options);
        const businessSelect = document.querySelector('#business_select');

        businessTypes.forEach((element, index) => {
          if (element.name === this.business) {
            // this.selectBusiness.selected = JSON.parse(JSON.stringify(element));
            businessSelect.selectedIndex = index + 1;
          } // else {
          //   document.querySelector('option[value="Other"]').selected = true;
          // }
          this.$M.FormSelect.init(businessSelect);
        });
      }
    },
  },
  mounted() {
    this.prefillForm();
  },
};
</script>
