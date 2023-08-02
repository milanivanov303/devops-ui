  <template>
  <div>
    <div class="row">
      <div class="col s12 m4">
        <div class="input-field">
          <input id="search" type="search" v-model="search" placeholder="Search by TTS Key">
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col s12 m4" v-for="build in computedFilteredBuilds" :key="build.id">
        <router-link :to="getTo(build)">
          <div class="card" @click="openInformationCard(build)">
            <div class="card-content">
              <div class="card-title truncate">
                TTS Key: {{ build.details.tts_key }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <Modal v-if="showInformationCard" @close="showInformationCard = false" class="right-sheet">
      <template v-slot:header>Build Information</template>
      <template v-slot:content>
        <Builds
          :module="'imx_combined'"
          :ttsKey="(selectedBuild && selectedBuild.details) ? selectedBuild.details.tts_key : ''"
          ref="buildsComponent"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import Builds from '@/components/Builds';

export default {
  components: {
    Modal,
    Builds,
  },

  props: {
    count: {},
  },

  data() {
    return {
      search: this.$route.query.search || '',
      showInformationCard: false,
      selectedBuild: null,
      filteredBuilds: [],
      status: ['active'],
    };
  },

  computed: {
    filteredBuildsFromStore() {
      return this.filteredBuilds;
    },
    computedFilteredBuilds() {
      if (this.search) {
        const searchTerm = this.search.toLowerCase();

        return this.filteredBuildsFromStore.filter((build) => {
          const ttsKey = build.details.tts_key.toLowerCase();
          return ttsKey.includes(searchTerm);
        });
      }
      return this.filteredBuildsFromStore;
    },
  },

  methods: {
    openInformationCard(build) {
      this.selectedBuild = build;
      this.showInformationCard = true;
    },

    getTo(build) {
      const query = { ...this.$route.query };
      query.tts_key = build.details.tts_key;

      return { query };
    },

    getBuilds() {
      const loader = this.$loading.show();

      // Dispatch the action for 'imx_be' module
      this.$store
        .dispatch('builds/getBuildsByStatus', {
          branch: this.branch,
          module: 'imx_be',
          status: this.getStatus(),
          createdBy: this.createdBy,
          perPage: this.perPage,
          page: this.page,
          search: this.search.trim(),
          ttsKey: this.selectedTtsKey,
        })
        .then((response) => {
          const imxBeBuilds = response.data.data;

          // Dispatch the action for 'imx_fe' module
          this.$store
            .dispatch('builds/getBuildsByStatus', {
              branch: this.branch,
              module: 'imx_fe',
              status: this.getStatus(),
              createdBy: this.createdBy,
              perPage: this.perPage,
              page: this.page,
              search: this.search.trim(),
              ttsKey: this.selectedTtsKey,
            })
            .then((response) => {
              const imxFeBuilds = response.data.data;

              // Combine data for 'imx_be' and 'imx_fe' builds
              const matchingBuilds = imxBeBuilds.filter((imxBeBuild) => {
                const matchingFeBuild = imxFeBuilds.find(
                  (imxFeBuild) => imxFeBuild.details
                  && imxFeBuild.details.tts_key === imxBeBuild.details.tts_key,
                );
                return matchingFeBuild;
              });

              this.filteredBuilds = matchingBuilds;
            })
            .finally(() => loader.hide());
        })
        .catch((error) => {
          console.error(error);
          loader.hide();
        });
    },

    getStatus() {
      if (this.status.indexOf('active') !== -1) {
        return this.status.concat(['running', 'building', 'stopped', 'deployed']);
      }

      return this.status;
    },
  },

  watch: {
    filteredBuilds: {
      immediate: true, // Trigger the watcher immediately when the component is created/mounted
      handler(builds) {
        // Check if the 'tts_key' parameter exists in the current URL query
        const ttsKeyFromUrl = this.$route.query.tts_key;

        // If the 'tts_key' parameter is present, find the corresponding build in 'filteredBuilds'
        if (ttsKeyFromUrl && builds.length > 0) {
          const matchingBuild = builds.find((build) => build.details.tts_key === ttsKeyFromUrl);

          if (matchingBuild) {
            this.openInformationCard(matchingBuild);
          }
        }
      },
    },
  },

  mounted() {
    this.getBuilds();

    const imxBeBuilds = this.$store.getters['builds/getActiveByModule']('imx_be');
    const imxFeBuilds = this.$store.getters['builds/getActiveByModule']('imx_fe');

    const matchingBuilds = imxBeBuilds.filter((imxBeBuild) => {
      const matchingFeBuild = imxFeBuilds.find(
        (imxFeBuild) => imxFeBuild.details
        && imxFeBuild.details.tts_key === imxBeBuild.details.tts_key,
      );
      return matchingFeBuild;
    });

    this.filteredBuilds = matchingBuilds;
  },
};
</script>
