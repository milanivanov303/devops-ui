<template>
  <div>
    <div class="col s12 l11">
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="Branch"
          icon="laptop_chromebook"
          :value="build.details.branch"
        />
      </div>
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="Instance"
          icon="dynamic_feed"
          :value="build.details.instance.name"
        />
      </div>
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="Client"
          icon="people"
          :value="build.details.client.name"
        />
      </div>
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="Java Version"
          icon="history"
          :value="build.details.java_version"
        />
      </div>
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="FE Branch"
          icon="laptop_chromebook"
          :value="build.details.fe_branch ? build.details.fe_branch.name : ''"
        />
      </div>
      <div class="row">
        <TextInput
          class="col s12 m6 readonly"
          label="Created on"
          icon="event"
          :value="build.created_on"
        />
        <TextInput
          class="col s12 m6 readonly"
          label="Created by"
          icon="person"
          :value="build.created_by"
        />
      </div>
      <div class="row" v-if="build.removed_on">
        <TextInput
          class="col s12 m6 readonly"
          label="Removed on"
          icon="event"
          :value="build.removed_on"
        />
        <TextInput
          class="col s12 m6 readonly"
          label="Removed by"
          icon="person"
          :value="build.removed_by"
        />
      </div>
      <div class="row" v-if="build.status === 'running'">
        <TextInput
          class="col s12 readonly"
          label="Deploy URL"
          icon="link"
          :value="build.details.url"
        />
      </div>
      <div class="row" v-if="build.details.image">
        <TextInput
          class="col s12 readonly"
          label="Docker image"
          icon="adjust"
          :value="build.details.image"
        />
      </div>
    </div>
  </div>
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
