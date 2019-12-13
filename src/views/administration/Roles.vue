<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table"> 
        <Table v-bind:request="request"  @add="createNew({})">
          <template v-slot:buttons="{ data }">
            <a @click="selectData(data)"><i class="material-icons right">attachment</i></a>
          </template>
        </Table>
      </div>

      <Modal v-if="showModal" @close="showModal = false" @opened="initModal()" class="right-sheet">
        <template v-slot:header>Create a new role
        </template>
        <template v-slot:content>
          <div class="col s12 l11 offset-l1"> 
            <div class="row">
              <div class="input-field col s12 m7 l10" :class="{invalid: $v.currentRole.name.$error}">
                <i class="material-icons prefix">group</i>
                <input 
                type="text" 
                id="name"
                v-model="currentRole.name"
                @blur="$v.currentRole.name.$touch()">
                <label :class="{active: currentRole.name}" for="name">Name</label>
              </div>
              <div class="validator col s12 m7 l10 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.currentRole.name.$error">
                  <p v-if="!$v.currentRole.name.required">Name field must not be empty.</p>
                  <p v-if="!$v.currentRole.name.minLen">Name must contain at least 6 charaters.</p>
                  <p v-if="!$v.currentRole.name.maxLen">Name must not be more than 255 charaters.</p>
                </div>
                <div class="green-text" v-if="!$v.currentRole.name.$invalid">
                  <p>Name accepted!</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 m7 l10" :class="{invalid: $v.currentRole.description.$error}">
                <i class="material-icons prefix">menu</i>
                <input 
                type="text" 
                id="name"
                v-model="currentRole.description"
                @blur="$v.currentRole.description.$touch()">
                <label :class="{active: currentRole.description}" for="name">Description</label>
              </div>
              <div class="validator col s12 m7 l10 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.currentRole.description.$error">
                  <p v-if="!$v.currentRole.description.required">Description field must not be empty.</p>
                  <p v-if="!$v.currentRole.description.minLen">Description must contain at least 6 charaters.</p>
                </div>
                <div class="green-text" v-if="!$v.currentRole.description.$invalid">
                  <p>Accepted!</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <ul class="tabs col s12">
                  <li class="tab col s6"><a href="#users">Users</a></li>
                  <li class="tab col s6"><a href="#actions">Actions</a></li>
                </ul>
                <div id="users">
                  <List :items="users" :selected="currentRole.users" v-model="currentRole.users"/>
                </div>
                  
                <div id="actions">
                  <List :items="actions" :selected="currentRole.actions" v-model="currentRole.actions"/>                 
                </div>
                      
              </div>
            </div> 
          </div> 
        </template>
        <template v-slot:footer>
          <button
            class="btn waves-effect waves-light"
            type="submit"
            name="action"
            @click="updateRole()"
          >
            Save
          </button>
        </template>
      </Modal>

    </div>
  </div>
</template>

<script>


import Modal from '@/components/partials/Modal';
import Table from '@/components/partials/Table';
import List from '@/components/partials/List';
import { required, email, numeric, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  data() {
    return { 
      showModal: false,
      currentRole: {},
      modalData: {},
      request: {
        data: 'roles',
        columns: {
          name: '',
          description: '',
         
        },
        add: true,
        export: false,
        action: false,
        searchable: true,
      },
      currentRole:{
        name: '',
        description: '',
        users: [],
        actions:[],
      },
      modalData: {
        name: '',
        description: '',
      },
    };
  },
  validations: {
    currentRole: {
      name: {
        required,
        minLen: minLength(6),
        maxLen: maxLength(255),

      },
      description: {
        required,
        minLen: minLength(6),
      }
    },
  },
  components: {
    Modal,
    Table,
    List,
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    roles() {
      return this.$store.getters.roles;
    },
    actions () {
      return this.$store.getters.actions;
    }
  },
  methods: {
    selectData(role) {
      this.showModal = true;
      this.currentRole = role;
    },
    createNew (role) {
        this.showModal = true;
        
        this.currentRole = {
          name: '',
          description: '',
          users: [],
          actions: [],
        };

    },
    initModal() {
      var elems = document.querySelectorAll('.tabs');
      this.$M.Tabs.init(elems);
    },
    async getUsers() {
      const loader = this.$loading.show({ container: this.$el });

      const payload = {
        with: JSON.stringify(['department']),
        orders: JSON.stringify({
          "name": "asc"
        }),
      };

      await this.$store.dispatch('getUsers', payload).then(() => {
        loader.hide();
      });
    },
    async getRoles() {
      const loader = this.$loading.show({ container: this.$el });

      const payload = {
        with: JSON.stringify(['actions', 'users']),
        orders: JSON.stringify({
          "name": "asc"
        }),
      };

      await this.$store.dispatch('getRoles', payload).then(() => {
        loader.hide();
      });
    },
     async getActions() {
      const loader = this.$loading.show({ container: this.$el });

      const payload = {
        with: JSON.stringify([]),
      };

      await this.$store.dispatch('getActions', payload).then(() => {
        loader.hide();
      });
    },
    updateRole() {
      delete this.currentRole.is_admin;
      this.$store.dispatch('updateRole', this.currentRole).then(() => {
        console.log('success !!!');
      });
    }
  },
  mounted() {
    this.getUsers();
    this.getRoles();
    this.getActions();

    var elems = document.querySelectorAll('select');
    this.$M.FormSelect.init(elems);

    var elems = document.querySelectorAll('.collapsible');
    this.$M.Collapsible.init(elems);
  },
};
</script>

<style lang="scss">
.input-field.inline {
    width: 40px;
}
</style>