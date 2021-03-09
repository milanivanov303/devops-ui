<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>{{ build.name }}</template>
    <template v-slot:content>
      <div class="col s12 l11">
        <div class="row">
          <TextInput
            class="col s12 readonly"
            label="FE Branch"
            icon="laptop_chromebook"
            v-model="build.details.branch"
          />
        </div>
        <div class="row">
          <TextInput
            class="col s12 readonly"
            label="Client"
            icon="people"
            v-model="build.details.client"
          />
        </div>
        <div class="row">
          <TextInput
            class="col s12 m6 readonly"
            label="Created on"
            icon="event"
            v-model="build.created_on"
          />
          <TextInput
            class="col s12 m6 readonly"
            label="Created by"
            icon="person"
            v-model="build.created_by"
          />
        </div>
        <div class="row" v-if="build.removed_on">
          <TextInput
            class="col s12 m6 readonly"
            label="Removed on"
            icon="event"
            v-model="build.removed_on"
          />
          <TextInput
            class="col s12 m6 readonly"
            label="Removed by"
            icon="person"
            v-model="build.removed_by"
          />
        </div>
      </div>
    </template>
    <template v-slot:footer></template>
  </Modal>
</template>

<script>
export default {
  props: {
    build: {
      type: Object,
      required: true,
    },
  },
};
</script>
