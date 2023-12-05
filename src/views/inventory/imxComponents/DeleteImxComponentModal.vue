<template>
  <Modal class="confirm"
         @close="$emit('close')"
  >
    <template v-slot:content>
      <div v-if="removing" class="center" >
        <Preloader class="big"/>
        <p>Removing component ...</p>
      </div>
      <div v-else-if="error" class="center">
        <i class="material-icons large red-text">error_outline</i>
        <p>{{ error }}</p>
      </div>
      <div v-else-if="!removed">
        <p>Are you sure you what to remove this component?</p>
      </div>
    </template>
    <template v-slot:footer>
      <button
        v-if="!removing && !removed"
        class="waves-effect btn red"
        @click="deleteImxComponent()"
      >
        <i class="material-icons left">delete</i> Remove
      </button>
    </template>
  </Modal>
</template>
<script>
export default {
  props: {
    component: {
      type: Object,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selected: this.component,
      removing: false,
      removed: false,
      error: '',
    };
  },
  methods: {
    deleteImxComponent() {
      this.removing = true;
      this.$store.dispatch('esxi/removeImxComponent', this.selected)
        .then(() => {
          this.removed = true;
          this.$emit('close');
          this.$M.toast({ html: 'Component has been deleted!', classes: 'toast-success' });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.error = 'You do not have sufficient rights to remove this component';
          }
        })
        .finally(() => { this.removing = false; });
    },
  },
};
</script>
