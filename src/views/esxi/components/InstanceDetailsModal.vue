<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>
      {{ instance.name.toUpperCase() }}'s details
    </template>
    <template v-slot:content>
      <ul class="collapsible popout">
        <li class="active">
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
