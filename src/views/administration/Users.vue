<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table">
        <Table v-bind:request="request">
          <template v-slot:buttons="{ data }">
              <a @click="selectedRow(data)" href="#"><i class="material-icons right">edit</i></a>
          </template>
        </Table>
      </div>

      <Modal v-if="showModal" @close="showModal = false" @opened="initModal()" class="right-sheet">
        <template v-slot:header>User information
        </template>
        <template v-slot:content>
          <div class="col s12 l10 offset-l1">
            <div class="row">
              <div class="col s12">
                <i class="material-icons">person</i>
                <span id="info">{{currentUser.name}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <i class="material-icons">account_circle</i>
                <span id="info">{{currentUser.username}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <i class="material-icons">mail</i>
                <span id="info">{{currentUser.email}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <i class="material-icons">phone</i>
                <span id="info">{{currentUser.phone}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <i class="material-icons">people</i>
                <span id="info">{{currentUser.department.name}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <ul class="tabs col s12">
                  <li class="tab col s12"><a href="#roles">Roles</a></li>
                </ul>
                <div id="roles">
                  <List :items="roles" :selected="currentUser.roles" v-model="currentUser.roles"/>
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
             @click="updateUserRoles()"
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


export default {
  data() {
    return {
      value: 10,
      showModal: false,
      currentUser: {},
      user: {
        roles: [],
      },
      request: {
        data: 'users',
        columns: {
          name: '',
          username: '',
          email: '',
          phone: '',
          department: 'name',
        },
        add: false,
        export: false,
        action: false,
        searchable: true,
      },
    };
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
  },
  methods: {
    selectedRow (user) {
      this.showModal = true;
      this.currentUser = user;
    },

    initModal() {
      var elems = document.querySelectorAll('.tabs');
      this.$M.Tabs.init(elems);
    },

    getUsers() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('getUsers').then(() => loader.hide());
    },

    getRoles() {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('getRoles').then(() => loader.hide());
    },

    updateUserRoles() {
      this.$store.dispatch('updateUserRoles', this.currentUser).then(() => {
        console.log('success !!!');
      });
      this.showModal = false;
    },
  },
  mounted() {
    this.getUsers();
    this.getRoles();

    var elems = document.querySelectorAll('.modal');
    this.$M.Modal.init(elems);
    var elems = document.querySelectorAll('.tabs');
    this.$M.Tabs.init(elems);
    var elems = document.querySelectorAll('select');
    this.$M.FormSelect.init(elems);
  },
};
</script>

<style lang="scss">
#info{
  font-size: 20px
}
</style>
