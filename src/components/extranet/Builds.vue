<template>
  <div>
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Status</th>
        <th>Created By</th>
        <th>Url</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(container, index) in containers" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ container.Labels.build }}</td>
        <td>{{ container.Status }}</td>
        <td>{{ container.Labels.username }}</td>
        <td>
          <a
            v-if="container.State === 'running'"
            :href="getDeployedBuildUrl(container)"
            target="_blank"
          >
            <i class="material-icons">cast_connected</i>
          </a>
        </td>
        <td>
          <button 
            v-bind:class="{ hidden: !$can('extranet.remove-builds') }"
            class="btn-small red"
            title="Remove build"
            @click="openRemoveBuildModal(container)"
          >
            <i class="material-icons left">delete</i> Remove
          </button>
        </td>
      </tr>
      <tr v-if="containers.length === 0">
        <td colspan="6">There are no builds yet</td>
      </tr>
      </tbody>
    </table>

    <Modal v-if="showModal" @close="showModal = false" class="confirm">
      <template v-slot:content>
        <div v-if="removing" class="center" >
          <Preloader class="big"></Preloader>
          <p>Removing build <b>{{ container.Labels.build }}</b> ... </p>
        </div>
        <div v-else-if="removed" class="center" >
          <i class="material-icons large green-text">check_circle_outline</i>
          <p>Build was removed successfully</p>
        </div>
        <div v-else-if="error" class="center">
          <i class="material-icons large red-text">error_outline</i>
          <p>{{ error }}</p>
        </div>
        <div v-else>
          Are you sure you what to remove <b>{{ container.Labels.build }}</b> build?
        </div>
      </template>
      <template v-slot:footer>
        <button
          v-if="!removing && !removed"
          class="waves-effect btn red"
          @click="removeBuild(container)"
        >
          <i class="material-icons left">delete</i> Remove
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/partials/Modal';
import Preloader from '@/components/partials/Preloader';

export default {
  components: {
    Modal,
    Preloader,
  },
  props: {
    containers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      container: null,
      removing: false,
      removed: false,
      error: null,
    };
  },
  computed: {
    host() {
      return this.$store.state.extranet.host;
    },
  },
  methods: {
    getDeployedBuildUrl(container) {
      const port = container.Ports.find(value => value.PrivatePort === 8591).PublicPort;
      return `http://${this.host}:${port}/${container.Labels.build}/`;
    },
    openRemoveBuildModal(container) {
      this.showModal = true;
      this.container = container;
      this.removing = false;
      this.removed = false;
      this.error = null;
    },
    removeBuild(container) {
      this.removing = true;
      this.$store.dispatch('extranet/removeBuild', container.Id)
        .then(() => {
          this.removed = true;
          this.$store.dispatch('extranet/getContainers');
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.error = 'You do not have insufficient rights to remove this build';
          } else {
            this.error = error;
          }
        })
        .finally(() => { this.removing = false; });
    },
  },
};
</script>
