<template>
  <div class="extranet">
    <div class="row">
      <div v-bind:key="branch.name" v-for="branch in branches">
        <Branch v-bind:branch="branch" />
      </div>
    </div>
  </div>
</template>

<script>
import Branch from "@/components/Branch";
import Api from "@/plugins/api";

const api = new Api(config.devops.url, config.devops.code);

export default {
  components: {
    Branch
  },
  data() {
    return {
      branches: []
    };
  },
  async created() {
    api.get("extranet/branches").then(branches => {
      this.branches = branches;
    });
  }
};
</script>
