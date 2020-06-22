<template>
  <div class="branches">
    <div class="row">
      <div class="col s12">
        <div class="col s12 m6 l5">
          <TextInput label="Search" icon="search" v-model="search"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-if="!checkBranch($route.params.branch)">
        <Branch
          v-for="branch in sortedBranches"
          class="col s12 m6 l4"
          :key="branch.name"
          :branch="branch"
          :count="getActiveBuildsCountByBranch(branch.name)"
        />
        <div class="col s12 m6 l2 right" id="perPage">
          <div class="input-field col s12 l4 right">
              <Select class="col s12"
                      v-if="sortedBranches.length"
                      :select="selectPerPage"
                      @selectedVal="selectedPerPage"/>
          </div>
          <p v-if="sortedBranches.length" class="col s12 l8 right right-align">Items per page:</p>
        </div>
        <div class="col s12 m6 l6">
          <paginate
          v-if="sortedBranches.length"
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
            :key="branch.name"
            :branch="branch"
            :count="getActiveBuildsCountByBranch(branch.name)"
            :class="{
              'selected-branch': $route.path === `/debiteur/branches/${branch.name}`
            }"
          />
        </div>
        <div class="col s12 m6 l7" >
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
import Branch from '@/views/debiteur/components/Branch';


export default {
  components: {
    Branch,
    paginate: Paginate,
  },
  data() {
    return {
      search: this.$route.query.search,
      page: 1,
      perPage: 12,
      lastPage: 0,
      selectPerPage: {
        id: 'perPage_select',
        name: 'perPage',
        displayed: 'name',
        options: [
          {
            name: 6,
          },
          {
            name: 9,
          },
          {
            name: 12,
          },
          {
            name: 15,
          },
        ],
        selected: { name: 12 },
      },
    };
  },
  computed: {
    branches() {
      return this.$store.state.debiteur.branches;
    },
    filteredBranches() {
      if (!this.search) {
        return this.branches;
      }

      const regexp = new RegExp(this.search, 'i');
      return this.branches.filter(branch => branch.name.match(regexp));
    },
    sortedBranches() {
      const from = (this.page * this.perPage) - this.perPage;
      const to = (this.page * this.perPage);
      const data = this.filteredBranches;
      this.setLastPage(data);
      return data.slice(from, to);
    },
  },
  methods: {
    getActiveBuilds() {
      this.$store.dispatch('builds/getActive');
      this.$store.dispatch('debiteur/getServices');
    },
    selectedPerPage(value) {
      this.perPage = value.name;
    },
    selectedPage(page) {
      this.page = page;
    },
    setLastPage(data) {
      this.selectPerPage.selected = { name: this.perPage };
      this.lastPage = Math.ceil(data.length / this.perPage);
    },
    getActiveBuildsCountByBranch(branch) {
      return this.$store.getters['builds/getActiveByBranch'](branch).length;
    },
    checkBranch(selected) {
      if (typeof selected !== 'undefined' && this.branches.length !== 0) {
        const branch = this.branches.find((branch) => {
          if (branch.name === selected) {
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
      this.$store.dispatch('debiteur/getBranches').then(() => {
        loader.hide();
        const branch = document.querySelector('.selected-branch');
        if (branch) {
          branch.scrollIntoView({
            block: 'start',
            inline: 'nearest',
          });
        }
      });
    },
  },
  mounted() {
    this.getBranches();
    this.getActiveBuilds();
  },
  watch: {
    search(value) {
      let query = {};
      if (value) {
        query = { search: value };
      }
      this.$router.push({ query });
    },
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
