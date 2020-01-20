<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table">
        <Table v-bind:request="request"  @add="openAddEditRoleModal({}, 'create')">
          <template v-slot:buttons="{ data }">
            <a @click="openRemoveRoleModal(data)" href="#"><i class="material-icons right">delete</i></a>
            <a @click="openAddEditRoleModal(data, 'update')" href="#"><i class="material-icons right">edit</i></a>
          </template>
        </Table>
      </div>

      <Modal
        v-if="showAddEditRoleModal"
        @close=" closeAddEditRoleModal()"
        @opened="initAddEditRoleModal()"
        class="right-sheet">
        <template v-slot:header>Create a new role
        </template>
        <template v-slot:content>
          <form @submit.prevent="onSubmit" class="col s12 l10 offset-l1">
            <Alert 
            v-if="error !== ''" 
            v-bind:msg="error"/>
            <div class="row">
              <div class="input-field col s12" :class="{invalid: $v.selectedRole.name.$error}">
                <i class="material-icons prefix">group</i>
                <input
                type="text"
                id="name"
                v-model="selectedRole.name"
                @blur="$v.selectedRole.name.$touch()"
                >
                <label :class="{active: selectedRole.name}" for="name">Name</label>
              </div>
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.selectedRole.name.$error">
                  <p v-if="!$v.selectedRole.name.required">Name field must not be empty.</p>
                  <p v-if="!$v.selectedRole.name.minLen">Name must contain at least 6 charaters.</p>
                  <p v-if="!$v.selectedRole.name.maxLen">Name must not be more than 255 charaters.</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12" :class="{invalid: $v.selectedRole.description.$error}">
                <i class="material-icons prefix">menu</i>
                <input
                type="text"
                id="description"
                v-model="selectedRole.description"
                @blur="$v.selectedRole.description.$touch()"
                >
                <label :class="{active: selectedRole.description}" for="description">Description</label>
              </div>
              <div class="validator col s12 offset-l1 offset-m1">
                <div class="red-text" v-if="$v.selectedRole.description.$error">
                  <p v-if="!$v.selectedRole.description.required">Description field must not be empty.</p>
                  <p v-if="!$v.selectedRole.description.minLen">Description must contain at least 6 charaters.</p>
                </div>
              </div>
            </div>
            <div class="row" v-if="$can('isAdministrators')">
                <div class="col s12">
                  <label>
                    <input
                    type="checkbox"
                    id="isAdmin_check"
                    :checked="selectedRole.is_admin"
                    @change="toggleIsAdmin()"
                    />
                    <span>Admin</span>
                  </label>
                </div>
            </div>
            <div class="row">
              <div class="col s12">

                <ul class="tabs col s12">
                  <li class="tab col s6"><a href="#users">Users</a></li>
                  <li class="tab col s6" :class="{disabled: (selectedRole.is_admin)}"><a href="#actions">Actions</a></li>
                </ul>
                <div id="users">
                  <UserList :items="users" :selected="selectedRole.users" groupBy="department.name" v-model="selectedRole.users"/>
                </div>
                <div id="actions">
                  <List :items="actions" :selected="selectedRole.actions" v-model="selectedRole.actions"/>
                </div>

              </div>
            </div>
          </form>
        </template>
        <template v-slot:footer>
          <button
            class="btn waves-effect waves-light"
            type="submit"
            name="action"
            @click="action === 'create' ? createRole() : updateRole()"
          >
            Save
          </button>
        </template>
      </Modal>

      <Modal v-if="showRemoveRoleModal" @close="showRemoveRoleModal = false" class="confirm">
        <template v-slot:content>
          <div v-if="removing" class="center" >
            <Preloader class="big"/>
            <p>Removing role ...</p>
          </div>
          <!-- <div v-else-if="removed" class="center" >
            <i class="material-icons large green-text">check_circle_outline</i>
            <p>Role was removed successfully</p>
          </div> -->
          <div v-else-if="error" class="center">
            <i class="material-icons large red-text">error_outline</i>
            <p>{{ error }}</p>
          </div>
          <div v-else>
            Are you sure you what to remove this role?
          </div>
        </template>
        <template v-slot:footer>
          <button
            v-if="!removing && !removed"
            class="waves-effect btn red"
            @click="deleteRole()"
          >
            <i class="material-icons left">delete</i> Remove
          </button>
        </template>
      </Modal>

    </div>
  </div>
</template>

<script>

  import config from "@/config";
  import Alert from '@/components/partials/Alert';
  import Modal from '@/components/partials/Modal';
  import Table from '@/components/partials/Table';
  import List from '@/components/partials/List';
  import UserList from '@/components/partials/UserList';
  import Preloader from '@/components/partials/Preloader';
  import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  components: {
    Alert,
    Modal,
    Table,
    List,
    UserList,
    Preloader,
  },
  data() {
    return {
      showAddEditRoleModal: false,
      showRemoveRoleModal: false,
      request: {
        data: 'roles',
        columns: {
          name: '',
          description: '',
          userCounter: (role) => role.users.length,
          is_admin: (role) => role.is_admin === 1 ? '<i class="material-icons">check</i>' : '' 
        },
        add: true,
        export: false,
        action: false,
        searchable: true,
      },
      action: null,
      selectedRole:{},
      removing: false,
      removed: false,
      error: '',
    };
  },
  validations: {
    selectedRole: {
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
  computed: {
    users() {
      return this.$store.getters.users;
    },
    roles() {
      return this.$store.getters.roles;
    },
    actions () {
      return this.$store.getters.actions;
    },
    // errorType () {
    //   return this.$store.getters.error;
    // }
  },
  methods: {
    openAddEditRoleModal(role, action) {
      this.showAddEditRoleModal = true;
      this.action = action;
      this.selectedRole = Object.assign({}, role);
      this.selectedRole.application = { code: config.devops.code };
    },
    closeAddEditRoleModal() {
      this.showAddEditRoleModal = false;
      this.$v.$reset();
    },
    openRemoveRoleModal(role) {
      this.showRemoveRoleModal = true;
      this.selectedRole = role;
      this.removing = false;
      this.removed = false;
      this.error = '';
    },
    initAddEditRoleModal() {
      var elems = document.querySelectorAll('.tabs');
      this.$M.Tabs.init(elems);
    },
    toggleIsAdmin() {
      if (isAdmin_check.checked) {
        this.selectedRole.is_admin = 1;
        var elems = document.querySelectorAll('.tabs');
        var instance = M.Tabs.getInstance(elems[0]);
        instance.select('users');
      }
      else{
        this.selectedRole.is_admin = 0;
      }
    },
    async getUsers() {
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('getUsers').then(() => loader.hide());
    },
    async getRoles() {
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('getRoles').then(() => loader.hide());
    },
    async getActions() {
      const loader = this.$loading.show({ container: this.$el });
      await this.$store.dispatch('getActions').then(() => loader.hide());
    },
    createRole() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.$store.dispatch('createRole', this.selectedRole)
      .then(() => {
        this.showAddEditRoleModal = false;
        this.$M.toast({html: 'The role has been created!', classes: 'toast-seccess'});
      })
      .catch((error) => {
        if (error.response.status === 422) {
          return this.error = 'Unprocessable Entity: Object required';
        }
        this.error = error;
      });
    },
    updateRole() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const id = this.selectedRole.id;
      const payload = this.selectedRole;

      this.$store.dispatch('updateRole', { id, payload })
      .then(() => {
        this.showAddEditRoleModal = false;
        this.$M.toast({html: 'The role has been updated!', classes: 'toast-seccess'})
      })
      .catch((error) => {
        if (error.response.status === 422) {
          return this.error = 'Unprocessable Entity: Object required';
        }
        this.error = error;
      });
    },
    deleteRole() {
      this.removing = true;
      this.$store.dispatch('deleteRole', this.selectedRole.id)
      .then(() => {
        this.removed = true;
        this.showRemoveRoleModal = false;
        this.$M.toast({html: 'The role has been deleted!', classes: 'toast-seccess'})
      })
      .catch((error) => {
        if (error.response.status === 403) {
          return this.error = 'You do not have insufficient rights to remove this role';
        }
        this.error = error;
      })
      .finally(() => this.removing = false);
    },
  },
  mounted() {
    this.getUsers();
    this.getRoles();
    this.getActions();
  },
};
</script>

<style lang="scss">
.input-field.inline {
    width: 40px;
}
</style>
