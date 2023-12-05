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
            <p v-if="instance.decommission_date">
              <b>Decommission date: </b>{{ instance.decommission_date.date }}
            </p>
            <p v-if="instance.decommission_date">
              <b>Decommission related task: </b>
              <a class="tbl-link" :href="'https://tts.codix.eu/jira/browse/' + instance.decommission_date.tts_key">{{ instance.decommission_date.tts_key }}</a>
            </p>
            <p><b>Home path: </b>{{ instance.home_path }}</p>
            <p><b>Patch Config Path: </b>{{ instance.patch_config_path }}</p>
          </div>
        </li>
        <li v-if="instance.ssl">
          <div class="collapsible-header"><i class="material-icons">laptop</i>SSL</div>
          <div class="collapsible-body">
            <p v-if="instance.ssl.BE">
              <b>BE: </b><a class="tbl-link" :href="instance.ssl.BE">{{ instance.ssl.BE }}</a>
            </p>
            <p v-if="instance.ssl.FE">
              <b>FE: </b><a class="tbl-link" :href="instance.ssl.FE">{{ instance.ssl.FE }}</a>
            </p>
            <p v-if="instance.ssl.status">
              <b>Status: </b> {{ instance.ssl.status }}
            </p>
            <p v-if="instance.ssl.lastActive">
              <b>Last active on: </b> {{ $date(instance.ssl.lastActive / 1000 ).toHuman() }}
            </p>
            <p v-if="instance.ssl.error">
              <b class="red-text">{{ instance.ssl.error }}</b>
            </p>
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
