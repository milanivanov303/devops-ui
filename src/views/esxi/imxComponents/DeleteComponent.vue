<!--<template>-->
<!--  <div class="row" ref="imxComponents">-->
<!--    <div class="col s12">-->
<!--      <div class="row">-->
<!--        <div class="col s12">-->
<!--          <TooltipButton-->
<!--            v-if="$auth.can('imx-component.delete')"-->
<!--            icon="delete"-->
<!--            tooltip="Delete component"-->
<!--            @click="deleteComponent()"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!-- </template>-->
<!--<script>-->
<!--    export default {-->
<!--      props: {-->
<!--        selectedImxComponent: Object,-->
<!--      },-->
<!--      data() {-->
<!--      return {-->
<!--       removing: false,-->
<!--       removed: false,-->
<!--       error: '',-->
<!--     };-->
<!--   },-->
<!--     methods: {-->
<!--       deleteComponent() {-->
<!--         this.removing = true;-->
<!--         this.$store.dispatch('esxi/deleteComponent', this.selectedImxComponent.id)-->

<!--           .then(() => {-->
<!--             this.removed = true;-->
<!--             this.$emit('close');-->
<!--             this.$M.toast({html: 'Component has been deleted!', classes: 'toast-success'});-->
<!--           })-->
<!--           .catch((error) => {-->
<!--             if (error.response.status === 403) {-->
<!--               this.error = 'You do not have insufficient rights to remove this component';-->
<!--             }-->
<!--           })-->
<!--           .finally(() => {-->
<!--             this.removing = false;-->
<!--           });-->
<!--       },-->
<!--     },-->
<!--    };-->
<!--   </script>-->
