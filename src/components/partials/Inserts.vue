<template>
  <div class="row">
    <h2 class="center modifications">Commands and Templates</h2>
    <table class="col s12 effort-table centered striped">
      <thead>
        <tr>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(command, key) in getCommands"
            v-bind:key="key">
          <td class="left-align">{{command.name}}</td>
          <td>
            <button class="btn-floating waves-effect waves-light left btn-small red"
                    type="button"
                    @click="remove(key)"
                    data-target="action"><i class="material-icons">remove</i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    modifications: {
      type: Array,
      required: true,
    },
  },
  methods: {
    remove(key) {
      this.modifications.splice(key, 1);
    },
  },
  computed: {
    getCommands() {
      const modificationsClone = this.modifications.slice();
      return modificationsClone;
    },
  },
};
</script>

<style lang='scss' scopped>
  .no-padding {
    padding-left: 0rem !important;
  }
  .btn-center {
    margin-top: 0.7rem;
  }
  input {
    margin-bottom: 0% !important;
  }
  .left-align {
    text-align: left !important;
    padding-left: 1em;
  }
  .modifications {
    font-size: 1.5rem;
  }
</style>
