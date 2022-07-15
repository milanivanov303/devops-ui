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

        <DeployOn :build="build" module="debiteur"/>

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
            id="debiteur_deploy_url"
            class="col s12 readonly"
            label="Deploy URL"
            icon="link"
            :value="build.details.url"
          />
        </div>
    </div>
  </div>
</template>

<script>
import DeployOn from '@/components/DeployOn';

export default {
  components: {
    DeployOn,
  },

  props: {
    build: {
      type: Object,
      required: true,
    },
  },
};
</script>
