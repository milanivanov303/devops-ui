<template>
  <div class="ttsKeys">
    <div class="row">
      <div class="col s12 m6 l5">
        <TextInput label="Search" icon="search" v-model="search"/>
      </div>
    </div>
    <div class="row">
      <div v-if="!checkTTSkey($route.params.key)" class="col s12">
        <div class="row">
          <TTSkey
            class="col s12 m6 l4"
            v-for="tts_key in sorted"
            :key="tts_key"
            :ttsKey="tts_key"
            :count="getActiveBuildsCountByBranch(tts_key)"
          />
        </div>
        <div class="row">
          <div class="col s12 m6 l2 right" id="perPage">
            <div class="input-field col s12 l4 right">
                <Select class="col s12"
                        displayed="value"
                        v-model="perPage"
                        :options="perPageOptions"
                />
            </div>
            <p v-if="sorted.length" class="col s12 l8 right right-align">Items per page:</p>
          </div>
          <div class="col s12 m6 l6">
            <paginate
            v-if="sorted.length"
            v-model="page"
            :page-count="lastPage"
            :click-handler="selectedPage"
            :prev-class="'material-icons'"
            :prev-text="'chevron_left'"
            :next-class="'material-icons'"
            :next-text="'chevron_right'"
            :container-class="'pagination'"
            :page-class="'waves-effect'"
            :disabled-class="'disabled'"
            :active-class="'active'">
            </paginate>
          </div>
        </div>

      </div>
      <div v-else>
        <div class="col s12 m6 l5 scroll" ref="ttsKeys">
          <TTSkey
            v-for="ttsKey in filteredTTSkeys"
            :key="ttsKey"
            :ttsKey="ttsKey"
            :count="getActiveBuildsCountByBranch(ttsKey)"
            :class="{
              'selected-branch': $route.path === `/imx/tts_keys/${encodeURIComponent(ttsKey)}`
            }"
          />
        </div>
        <div class="col s12 m6 l7">
          <div class="card">
            <div class="card-content">
              <transition name="ttsKey" mode="out-in">
                <router-view :key="$route.path"/>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate/src/components/Paginate';
import TTSkey from './components/TTSkey';
import EventBus from '@/event-bus';

export default {
  components: {
    paginate: Paginate,
    TTSkey,
  },
  data() {
    return {
      search: this.$route.query.search,
      page: 1,
      perPage: {
        value: 12,
      },
      lastPage: 0,
      perPageOptions: [
        {
          value: 6,
        },
        {
          value: 9,
        },
        {
          value: 12,
        },
        {
          value: 15,
        },
      ],
    };
  },
  computed: {
    ttsKeys() {
      return this.$store.getters['builds/getTTSkeysFromActiveBuilds']('imx');
    },
    filteredTTSkeys() {
      if (!this.search) {
        return this.ttsKeys;
      }

      const regexp = new RegExp(this.search, 'i');
      return this.ttsKeys.filter(key => key.match(regexp));
    },
    sorted() {
      const from = (this.page * this.perPage.value) - this.perPage.value;
      const to = (this.page * this.perPage.value);
      const data = this.filteredTTSkeys;
      this.setLastPage(data);
      return data.slice(from, to);
    },
  },
  methods: {
    getActiveBuilds() {
      this.$store.dispatch('builds/getActive');
    },
    selectedPage(page) {
      this.page = page;
    },
    setLastPage(data) {
      this.lastPage = Math.ceil(data.length / this.perPage.value);
    },
    getActiveBuildsCountByBranch(key) {
      return this.$store.getters['builds/getActiveByTTSkey'](key).length;
    },
    checkTTSkey(selected) {
      if (typeof selected !== 'undefined' && this.ttsKeys.length !== 0) {
        const key = this.ttsKeys.find((key) => {
          if (key === selected) {
            return true;
          }
          return false;
        });

        if (key) {
          return true;
        }
        this.$M.toast({ html: 'This TTS key does not exist!', classes: 'toast-fail' });
      }
      return false;
    },
  },
  watch: {
    search(value) {
      let query = {};
      if (value) {
        query = { search: value };
      }
      this.$router.push({ query });
    },
    perPage() {
      this.setLastPage(this.filteredBranches);
    },
  },
  mounted() {
    this.getActiveBuilds();
  },
  created() {
    EventBus.$on('build.created', () => {
      this.getActiveBuilds();
    });
  },
};
</script>
<style scoped>

</style>
