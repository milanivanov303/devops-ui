<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table">
        <!-- <Table v-bind:request="request" ></Table> -->
        <div class="row">
          <div class="input-field col s12 l7">
            <i class="material-icons prefix">search</i>
            <input type="text" class="validate" placeholder="Search...">
          </div>
        </div> 
        <table class="responsive-table"> 
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.department.name }}</td>
            <td>
              <a class="modal-trigger" href="#modal-user"><i class="material-icons">attachment</i></a>
            </td>
          </tr>
        </tbody>
        </table>
        <div class="row">
          <div class="col s12 m6 l6 right right-align">
            <div class="input-field inline">
              <select>
                <option value="3" class="selected" >3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
            Items per page
          </div>
          
          <div class="col s12 m6 l6">
            pagination goes here
          </div>
        </div>  

        <div id="modal-user" class="modal right-sheet modal-fixed-footer">
          <div class="modal-content">
            <div class="row">
              <div class="col s12 l11 offset-l1">
                <div class="header">
                  <h4 class="left">User information</h4>
                  <a href="#!" class="modal-close waves-effect waves-green btn-flat right">
                  <i class="material-icons">close</i>
                </a>
                </div>
              </div>
            </div>
            <div class="col s12 l11 offset-l1"> 
              <div class="row">
                <div class="col s12 m7 l10">
                  <i class="material-icons">person</i>
                  <span id="info">Iskren Marinov</span>
                </div>
              </div>
              <div class="row">
                <div class="col s12 m7 l10">
                  <i class="material-icons">account_circle</i>
                   <span id="info">imarinov</span>
                  
                </div>
              </div>
              <div class="row">
                <div class="col s12 m7 l10">
                  <i class="material-icons">mail</i>
                  <span id="info">imarinov@codix.bg</span>
                </div>
              </div>
              <div class="row">
                <div class="col s12 m7 l10">
                  <i class="material-icons">phone</i>
                  <span id="info">8080229</span>
                </div>
              </div><div class="row">
                <div class="col s12 m7 l10">
                  <i class="material-icons">people</i>
                  <span id="info">IMX V9</span>
                </div>
              </div>
              <div class="row">
                <div class="col s12">
                  <ul class="tabs col s12 l12">
                    <li class="tab col s12 l12"><a href="#groups">Groups</a></li>
                  </ul>
                  <div id="groups">
                    <br>
                    <div class="col s12 l6 left">
                      <table class="responsive">
                        <input type="text" placeholder="Search">
                        <a class="waves-effect waves-light btn-small">
                          <i class="material-icons left">add</i>
                          Add all groups
                          </a>
                        <tr>
                          <th>Name</th>
                        </tr>
                        <tr>
                          <td>
                            Group 1
                            <a href="#!"><i class="material-icons tiny">add_circle</i><b> Add</b></a>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Group 2 
                            <a href="#!"><i class="material-icons tiny">add_circle</i><b> Add</b></a>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div class="col s12 l6 right">
                      <table class="responsive">
                         <input type="text" placeholder="Search">
                        <a class="waves-effect waves-light btn-small">
                          <i class="material-icons left">remove</i>
                          Remove all groups
                          </a>
                        <tr>
                          <th>Name</th>
                        </tr>
                        <tr>
                          <td>
                            Group 3
                            <a href="#!"><i class="material-icons tiny">do_not_disturb_on</i><b> Remove</b></a>
                          </td>
                        </tr>
                      </table>
                    </div> 
                  </div>                       
                </div>
              </div>  
            </div>
          </div>

          <div class="modal-footer">
            <a href="#!" class="waves-effect waves-green btn">Save</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
  computed: {
    users() {
      return this.$store.getters.users.slice(0, 10);
    }
  },
  methods: {
    
    async getUsers() {
      const loader = this.$loading.show({ container: this.$el });

      const payload = {
        with: JSON.stringify(['department']),
      };

      await this.$store.dispatch('getUsers', payload).then(() => {
        loader.hide();
      });
    },
  },
  mounted() {
    this.getUsers();

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
.input-field.inline {
    width: 40px;
}
#info{
  font-size: 20px
}
</style>
