<template>
    <div>
        <h1 class="center flow-text" >Schedule a demo</h1>
        <div class="row">
            <div class="col s12 m7 l7">
                <form @submit.prevent="onSubmit">
                    <div class="row">
                        <div class="input-field col s12" :class="{invalid: $v.name.$error}">
                            <i class="material-icons prefix">person</i>
                            <input
                                type="text"
                                id="name"
                                @blur="$v.name.$touch()"
                                v-model="name">                            
                            <label for="name">Name</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12" :class="{invalid: $v.email.$error}">
                            <i class="material-icons prefix">mail</i>
                            <input
                                type="email"
                                id="email"
                                @blur="$v.email.$touch()"
                                v-model="email">
                            <label for="email">Mail</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12" :class="{invalid: $v.company.$error}">
                            <i class="material-icons prefix">business</i>
                            <input
                                type="text"
                                id="company"
                                @blur="$v.company.$touch()"
                                v-model="company">                            
                            <label for="company">Company</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12" :class="{invalid: $v.phone.$error}">
                            <i class="material-icons prefix">call</i>
                            <input
                                type="text"
                                id="phone"
                                @blur="$v.phone.$touch()"
                                v-model="phone">
                            <label for="phone">Phone</label>
                        </div>
                    </div>
                    <div class="row">
                        <business-select class="col s12"
                                         v-bind:select="selectBusiness" 
                                         v-on:selectedVal="selectedBusiness"/>
                    </div>
                    <div class="row">
                        <date-range class="col s12"
                                    v-on:startDatePick="selectedStartDate"
                                    v-on:endDatePick="selectedEndDate"/>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <i class="material-icons prefix">mode_edit</i>
                            <textarea id="details" 
                                    class="materialize-textarea"
                                    v-model="details"></textarea>
                            <label for="icon_prefix2">Details</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <button class="btn waves-effect waves-light right" type="submit" name="action" :disabled="$v.$invalid">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div v-if="$v.$invalid" class="alert error col s12 m4 l4 right">
                <h2 class="center flow-text white-text">Form errors</h2>
                <span class="white-text">
                    <p v-if="!$v.name.required">Name field must not be empty.</p>
                    <p v-if="!$v.name.minLen">Name must contain at least 6 charaters.</p>
                    <p v-if="!$v.email.email">Please provide a valid email address.</p>
                    <p v-if="!$v.email.required">Email must not be empty.</p>
                    <p v-if="!$v.company.required">Company field must not be empty.</p>
                    <p v-if="!$v.phone.numeric">Phone field must contain only numbers.</p>
                    <p v-if="!$v.business.required">Business field must not be empty.</p>
                    <p v-if="!$v.startDate.required">Start date field must not be empty.</p>
                    <p v-if="!$v.endDate.required">End date field must not be empty.</p>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { required, email, numeric, minValue, maxValue, minLength, } from 'vuelidate/lib/validators';
import SelectBusiness from '@/components/partials/Select';
import DateRange from '@/components/partials/DateRange';
import queryString from 'query-string';

  export default {
    data () {
      return {
        name: '',
        email: '',
        company: '',
        phone: '',
        business: '',       
        startDate: '',
        endDate: '',
        details: '',
        selectBusiness: {
            id: 'businsess',
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
            },
            label: 'Business area',
        },
      };
    },
    components: {
        'business-select': SelectBusiness,
        'date-range': DateRange,
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
    },
    methods: {
      selectedBusiness(value) {
          this.$v.business.$touch();
          this.business = value;
      },
      selectedStartDate(value) {
          this.$v.startDate.$touch();          
          this.startDate = value;
      },
      selectedEndDate(value) {
          this.$v.endDate.$touch();
          this.endDate = value;
      },
      onSubmit () {
        const formData = {
            name: this.name,
            email: this.email,
            company: this.company,
            business: this.business,
            startDate: this.startDate,
            endDate: this.endDate,
            phone: this.phone,
            details: this.details,
        };
        console.log(formData)
      },
    },
    mounted () {
        // ?name=Tzetzo&mail=tzeco@cso.bg&company=codix&phone=123125412&business=Leasing'
        const data = queryString.parse(location.search);
        if(data) {
            this.name = data.name;
            this.email = data.email;
            this.company = data.company;
            this.business = data.business;
            this.phone = data.phone;
        }
        console.log(data);
    },
  };
</script>

<style scoped>

</style>