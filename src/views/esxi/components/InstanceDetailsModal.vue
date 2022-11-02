<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>
      {{ instance.name.toUpperCase() }}'s details
    </template>
    <template v-slot:content>
      <ul class="collapsible popout">
        <li class="active" >
          <div class="collapsible-header"><i class="material-icons">laptop</i>Main Detail</div>
          <div class="collapsible-body">
            <p><b>Home path: </b>{{ instance.home_path }}</p>
            <p><b>Patch Config Path: </b>{{ instance.patch_config_path }}</p>
          </div>
        </li>
        <li v-if="instance.ssl">
          <div class="collapsible-header"><i class="material-icons">laptop</i>SSL</div>
          <div class="collapsible-body">
            <p><b>BE: </b><a class="tbl-link" :href="instance.ssl.BE">{{ instance.ssl.BE }}</a></p>
            <p><b>FE: </b><a class="tbl-link" :href="instance.ssl.FE">{{ instance.ssl.FE }}</a></p>
            <p><b>Status: </b> {{ instance.ssl.status }}</p>
          </div>
        </li>
        <li v-if="instance.filesystem">
          <div class="collapsible-header"><i class="material-icons">cast</i>Filesystem</div>
          <div class="collapsible-body">
            <p><b>Size: </b> {{ instance.filesystem.size }}</p>
            <p style="white-space: pre-wrap;">{{ instance.filesystem.files }}</p>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:footer></template>
  </Modal>
</template>

<script>
export default {
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const elems = document.querySelectorAll('.collapsible');
    this.$M.Collapsible.init(elems);
  },
};
</script>

<style scoped>

</style>
