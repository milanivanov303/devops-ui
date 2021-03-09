<template>
  <div class="row">
    <h1 class="center">Modules</h1>
    <div class="col s12 l8">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Abbreviation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ index + 1 }}</td>
            <td>
              <!-- <router-link v-bind:to="'/modules'"> </router-link> -->
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import config from "@/config";

export default {
  components: {},
  created() {
    this.loadData();
  },
  mounted() {
    this.getIssue();
  },
  watch: {},
  data() {
    return {};
  },
  validations: {},
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
