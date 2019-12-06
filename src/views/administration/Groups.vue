<template>
  <div class="row">
    <div class="col s12">
      <div class="data-table"> 
        <div class="row">
          <div class="input-field col s12 l7">
            <i class="material-icons prefix">search</i>
            <input type="text" class="validate" placeholder="Search...">
          </div>
        </div> 
        <button data-target="modal-group" class="btn modal-trigger right"> 
          <i class="material-icons left">add</i>New Group
          </button>

          <table class="responsive-table"> 
          <thead>
            <tr>
              <th>Name</th>
              <th>Members</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Group 1</td>
              <td>2</td>
              <td>Description</td>
              <td class="right">
                <a class="modal-trigger" href="#modal-group"><i class="material-icons">attachment</i></a>
                <a href="#"><i class="material-icons">delete</i></a>
              </td>
            </tr>
            <tr>
              <td>Group 2</td>
              <td>10</td>
              <td>Description</td>
              <td class="right">
                <a class="modal-trigger" href="#modal-group"><i class="material-icons">attachment</i></a>
                <a href="#"><i class="material-icons">delete</i></a>
              </td>
            </tr>
            <tr>
              <td>Group 3</td>
              <td>7</td>
              <td>Description</td>
              <td class="right">
                <a class="modal-trigger" href="#modal-group"><i class="material-icons">attachment</i></a>
                <a href="#"><i class="material-icons">delete</i></a>
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
              <ul class="pagination">
                <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                <li class="waves-effect"><a href="#!">1</a></li>
                <li class="waves-effect active"><a href="#!">2</a></li>
                <li class="waves-effect"><a href="#!">3</a></li>
                <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
              </ul>
            </div>
          </div>
        </div>




        <div id="modal-group" class="modal right-sheet modal-fixed-footer">
          <div class="modal-content">
            <div class="row">
              <div class="col s12 l11 offset-l1">
                <div class="header">
                  <h4 class="left">Create a new group</h4>
                  <a href="#!" class="modal-close waves-effect waves-green btn-flat right">
                  <i class="material-icons">close</i>
                </a>
                </div>
              </div>
            </div>
            <div class="col s12 l11 offset-l1"> 
              <div class="row">
                <div class="input-field col s12 m7 l10">
                  <i class="material-icons prefix">group</i>
                  <input type="text" id="name">
                  <label for="name">Group name</label>
                </div>
                <div class="validator col s12 m7 l10 offset-l1 offset-m1">
                  <div class="red-text">
                    <p>Name field must not be empty.</p>
                    <p>Name must contain at least 6 charaters.</p>
                  </div>
                  <div class="green-text">
                    <p>Name accepted!</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12 m7 l10">
                  <i class="material-icons prefix">menu</i>
                  <input type="text" id="name">
                  <label for="name">Description</label>
                </div>
                <div class="validator col s12 m7 l10 offset-l1 offset-m1">
                  <div class="red-text">
                    <p>Description field must not be empty.</p>
                    <p>Description must contain at least 6 charaters.</p>
                  </div>
                  <div class="green-text">
                    <p>Accepted!</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col s12">
                  <ul class="tabs col s12">
                    <li class="tab col s6"><a href="#users">Users</a></li>
                    <li class="tab col s6"><a href="#rights">Rights</a></li>
                  </ul>
                  <div id="users">
                    <br>
                    <div class="col s12 l6 left">
                      <table class="responsive">
                        <input type="text" placeholder="Search">
                        <a class="waves-effect waves-light btn-small">
                          <i class="material-icons left">add</i>
                          Add all users
                          </a>
                        <tr>
                          <th>Name</th>
                        </tr>
                        <tbody id="ea">
                          <label for="ea">Enterprise Applications</label>
                          <tr>
                            <td>
                              Ivan
                              <a href="#!"><i class="material-icons tiny">add_circle</i><b> Add</b></a>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Andrei 
                              <a href="#!"><i class="material-icons tiny">add_circle</i><b> Add</b></a>
                            </td>
                          </tr>
                        </tbody>
                        <tbody id=id>
                          <label for="id">Installations and Deliveries</label>
                          <tr>
                            <td>
                              Georgi 
                              <a href="#!"><i class="material-icons tiny">add_circle</i><b> Add</b></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div class="col s12 l6 right">
                      <table class="responsive">
                         <input type="text" placeholder="Search">
                        <a class="waves-effect waves-light btn-small">
                          <i class="material-icons left">remove</i>
                          Remove all users
                          </a>
                        <tr>
                          <th>Name</th>
                        </tr>
                        <tr>
                          <td>
                            Petar
                            <a href="#!"><i class="material-icons tiny">do_not_disturb_on</i><b> Remove</b></a>
                          </td>
                        </tr>
                      </table>
                    </div> 
                  </div>
                    
                  <div id="rights">
                  </div>
                       
                </div>
              </div>  
            </div>
          </div>

          <div class="modal-footer">
            <a href="#!" class="waves-effect waves-green btn">Create</a>
            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
          </div>
        </div>

    </div>
  </div>
</template>

<script>



export default {
  mounted() {
    var elems = document.querySelectorAll('.modal');
    this.$M.Modal.init(elems);

    var elems = document.querySelectorAll('select');
    this.$M.FormSelect.init(elems);

    var elems = document.querySelectorAll('.tabs');
    this.$M.Tabs.init(elems);

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