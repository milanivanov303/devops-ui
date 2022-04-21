<template>
  <div>
    <h1 class="center">Cms Modules Details</h1>
    <form ref="form" @submit.prevent="onSubmit">
      <Alert
          v-if="error !== ''"
          v-bind:msg="error"/>
      <div class="row">
        <div  class="input-field col l5 m6 s6">
          <i class="material-icons prefix">memory</i>
          <label for="module" class="active">Module</label>
          <input
              id="module"
              type="text"
              v-model="module"
          />
<!--          <div class="validator red-text" v-if="$v.form.project.$error">-->
<!--            <span v-if="!$v.form.project.required">Module field must not be empty.</span>-->
<!--          </div>-->
        </div>
        <div class="input-field col s12 m4 l5">
          <i class="material-icons prefix">description</i>
          <label for="subModule" class="active">Sub Module</label>
          <input
              id="subModule"
              type="text"
              v-model="subModule"
          />
<!--          <div class="validator red-text" v-if="$v.form.details.$error">-->
<!--            <span v-if="!$v.form.details.required">Details field must not be empty.</span>-->
<!--          </div>-->
        </div>
        <div class="col s12 l12">
          <button
              class="btn waves-effect waves-light right"
              type="button"
              name="action">Add
          </button>
        </div>
      </div>
    </form>
    <Table
        :data="modules"
        sort-by="name"
        sort-dir="asc"
        :export-btn="false"
        :view-btn="false"
        :add-btn="false"
        :edit-btn="false"
        :delete-btn="true"
        @delete="(row) => onDelete(row, 'delete')"
        @update="(row) => openEditModal(row, 'update')">
      <Column show="name"/>
      <Column show="abbreviation"/>
      <template v-slot:actions-before="{ row }">
        <a
            @click="openEditModal(row, 'update')"
            data-tooltip="Check/Update data"
            class="tooltipped">
          <i class="material-icons update">edit</i>
        </a>
      </template>
    </Table>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {

  data() {
    return {
      module: '',
      subModule: '',
      error: '',
      form: {},
      project: '',
      projects: [],
      showEditModal: false,
      selectedDetail: {},
    };
  },
  validations: {},
  computed: {
    modules() {
      return this.$store.getters['cms/modules'];
    },
  },
  methods: {},
  created() {
    this.$store.dispatch('cms/getModules');
  },
};
</script>
