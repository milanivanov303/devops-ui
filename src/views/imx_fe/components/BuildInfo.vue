<template>
  <div>
    <div class="col s12 l11">
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="FE Branch"
          icon="laptop_chromebook"
          :value="build.details.branch"
        />
      </div>
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="Client"
          icon="people"
          :value="build.details.client"
        />
      </div>
      <div class="row">
        <TextInput
          class="col s12 readonly"
          label="Endpoint"
          icon="link"
          :value="build.details.endpoint"
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
        <div class="input-field col s12">
          <i class="material-icons prefix">link</i>
          <a :href="build.details.url" target="_blank" rel="noopener noreferrer">
            <input id="deploy-url"
                   class="readonly"
                   type="text"
                   :value="build.details.url">
          </a>
          <label :class="{active: build.details.url}" for="deploy-url">Deploy URL</label>
        </div>
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

<style lang="scss" scoped>
#deploy-url {
  margin-left: 3rem;
}
</style>
