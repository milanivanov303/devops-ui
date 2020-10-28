<template>
  <div class="branches">
    <div class="row">
      <div class="col s12 m6 l5">
        <TextInput label="Search" icon="search" v-model="search"/>
      </div>
    </div>
    <div class="row">
      <div v-if="!checkBranch($route.params.branch)">
        <Branch
          class="col s12 m6 l4"
          v-for="branch in sorted"
          :key="branch"
          :branch="branch"
          :count="getActiveBuildsCountByBranch(branch)"
        />
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
      <div v-else>
        <div class="col s12 m6 l5 scroll" ref="branches">
          <Branch
            v-for="branch in filteredBranches"
            :key="branch"
            :branch="branch"
            :count="getActiveBuildsCountByBranch(branch)"
            :class="{
              'selected-branch': $route.path === `/imx-fe/branches/${encodeURIComponent(branch)}`
            }"
          />
        </div>
        <div class="col s12 m6 l7">
          <div class="card">
            <div class="card-content">
              <transition name="branch" mode="out-in">
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
import Branch from '@/views/imx-fe/components/Branch';
import EventBus from '@/event-bus';


export default {
  components: {
    Branch,
    paginate: Paginate,

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
    branches() {
      return this.$store.state.imx_fe.branches;
    },
    filteredBranches() {
      if (!this.search) {
        return this.branches;
      }

      const regexp = new RegExp(this.search, 'i');
      return this.branches.filter(branch => branch.match(regexp));
    },
    sorted() {
      const from = (this.page * this.perPage.value) - this.perPage.value;
      const to = (this.page * this.perPage.value);
      const data = this.filteredBranches;
      this.setLastPage(data);
      return data.slice(from, to);
    },
  },
  methods: {
    getActiveBuilds() {
      this.$store.dispatch('builds/getActive');
      this.$store.dispatch('imx_fe/getHost');
    },
    selectedPage(page) {
      this.page = page;
    },
    setLastPage(data) {
      this.lastPage = Math.ceil(data.length / this.perPage.value);
    },
    getActiveBuildsCountByBranch(branch) {
      return this.$store.getters['builds/getActiveByBranch'](branch).length;
    },
    checkBranch(selected) {
      if (typeof selected !== 'undefined' && this.branches.length !== 0) {
        const branch = this.branches.find((branch) => {
          if (branch === selected) {
            return true;
          }
          return false;
        });

        if (branch) {
          return true;
        }
        this.$M.toast({ html: 'This branch does not exist!', classes: 'toast-fail' });
      }
      return false;
    },
    getBranches() {
      const loader = this.$loading.show({ container: this.$refs.branches });
      this.$store.dispatch('imx_fe/getBranches')
        .then(() => {
          const branch = document.querySelector('.selected-branch');
          if (branch) {
            branch.scrollIntoView({
              block: 'start',
              inline: 'nearest',
            });
          }
        })
        .finally(() => loader.hide());
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
    this.getBranches();
    this.getActiveBuilds();
  },

  created() {
    EventBus.$on('build.created', () => {
      this.getActiveBuilds();
    });
  },
};
</script>

<style lang="scss">
  .selected-branch {
    background-color: #ccc;
  }
  .scroll {
    max-height: 72.5vh;
    overflow-x: auto;
  }
</style>
