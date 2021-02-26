<template>
  <Modal @close="$emit('close')" class="right-sheet">
    <template v-slot:header>{{ selectedBuild.name }}</template>
    <template v-slot:content>
      <div class="col s12 l11">
        <div class="row" v-if="selectedBuild.tts_key">
          <TextInput
            class="col s12 readonly"
            label="TTS Key"
            icon="apps"
            v-model="selectedBuild.tts_key"
          />
        </div>
        <div class="row">
          <TextInput
            class="col s12 readonly"
            :label="'Branch'"
            icon="laptop_chromebook"
            v-model="selectedBuild.branch"
          />
        </div>
        <div class="row">
          <TextInput
            class="col s12 readonly"
            label="Instance"
            icon="dynamic_feed"
            v-model="selectedBuild.instance"
          />
        </div>
        <div class="row" v-if="selectedBuild.fe_branch">
          <TextInput
            class="col s12 readonly"
            label="FE Branch"
            icon="laptop_chromebook"
            v-model="selectedBuild.fe_branch"
          />
        </div>
        <div class="row" v-if="selectedBuild.client">
          <TextInput
            class="col s12 readonly"
            label="Client"
            icon="people"
            v-model="selectedBuild.client"
          />
        </div>
        <div class="row"  v-if="selectedBuild.java_version">
          <TextInput
            class="col s12 readonly"
            label="Java Version"
            icon="history"
            v-model="selectedBuild.java_version"
          />
        </div>
        <div class="row">
          <TextInput
            class="col s12 m6 readonly"
            label="Created on"
            icon="event"
            v-model="selectedBuild.created_on"
          />
          <TextInput
            class="col s12 m6 readonly"
            label="Created by"
            icon="person"
            v-model="selectedBuild.created_by"
          />
        </div>
        <div class="row" v-if="selectedBuild.removed_on">
          <TextInput
            class="col s12 m6 readonly"
            label="Removed on"
            icon="event"
            v-model="selectedBuild.removed_on"
          />
          <TextInput
            class="col s12 m6 readonly"
            label="Removed by"
            icon="person"
            v-model="selectedBuild.removed_by"
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
  data() {
    return {
      selectedBuild: {},
    };
  },
  methods: {
    loadData() {
      this.selectedBuild.name = this.build.name;
      if (this.build.details.tts_key) {
        this.selectedBuild.tts_key = this.build.details.tts_key;
      }
      this.selectedBuild.branch = this.build.details.be
        ? this.build.details.be.branch : this.build.details.branch;
      this.selectedBuild.instance = this.build.details.be
        ? this.build.details.be.instance.name : this.build.details.instance.name;
      if (this.build.details.fe || this.build.fe_branch) {
        this.selectedBuild.fe_branch = this.build.fe_branch || this.build.details.fe.branch;
      }
      if (this.build.details.client) {
        this.selectedBuild.client = this.build.details.client.name || this.build.details.client;
      } else if (this.build.details.fe) {
        this.selectedBuild.client = this.build.details.fe.client;
      }
      if (this.build.details.java_version) {
        this.selectedBuild.java_version = this.build.details.java_version;
      }
      this.selectedBuild.created_on = this.$date(this.build.created_on).toHuman();
      this.selectedBuild.created_by = this.build.created_by;
      if (this.build.removed_on) {
        this.selectedBuild.removed_on = this.$date(this.build.removed_on).toHuman();
      }
      if (this.build.removed_by) {
        this.selectedBuild.removed_by = this.build.removed_by;
      }
      if (this.build.removed_on && !this.build.removed_by) {
        this.selectedBuild.removed_by = 'auto-removed';
      }
    },
  },
  created() {
    this.loadData();
  },
};
</script>
