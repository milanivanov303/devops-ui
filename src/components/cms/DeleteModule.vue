<template>
  <Modal class="confirm"
         @close="$emit('close')"
  >
    <template v-slot:content>
      <div v-if="removing" class="center" >
        <Preloader class="big"/>
        <p>Removing module ...</p>
      </div>
      <div v-else-if="error" class="center">
        <i class="material-icons large red-text">error_outline</i>
        <p>{{ error }}</p>
      </div>
      <div v-else-if="!removed">
        <p>Are you sure you what to remove this module?</p>
      </div>
    </template>
    <template v-slot:footer>
      <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="remove()"
      >
        <i class="material-icons left">delete</i> Remove
      </button>
    </template>
  </Modal>
</template>
<script>
export default {
  props: {
    selectedModule: Object,
  },
  data() {
    return {
      removing: false,
      removed: false,
      error: '',
    };
  },
  methods: {
    remove() {
      this.removing = true;
      this.$store.dispatch('cms/deleteModule', this.selectedModule.id)
        .then(() => {
          this.removed = true;
          this.$emit('close');
          this.$M.toast({ html: 'Module has been removed!', classes: 'toast-success' });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.error = 'You do not have insufficient rights to remove this module';
          }
        })
        .finally(() => { this.removing = false; });
    },
  },
};
</script>
