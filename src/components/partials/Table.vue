<template>
  <div>
    <div class="row">
      <div  v-if="request.searchable" class="input-field col s12 m6 l6">
        <i class="material-icons prefix">search</i>
          <input type="text"
                @input="selectedPage(1)"
                v-model="search"
                placeholder="Search..">
      </div>
      <div class="col s3 m2 l6 right">
        <button class="btn-floating modal-triger right"
                v-if="request.add"
                @click="$emit('add')"
                data-target="action"><i class="material-icons left">add</i>
        </button>
        <button class="btn-floating waves-effect waves-light right"
                @click="$emit('export')"
                v-if="request.export"
                data-target="action"><i class="material-icons left">description</i>
        </button>
      </div>
    </div>
    <table class="responsive-table">
      <thead>
        <tr>
          <th v-for="(value, key) in columns"
              @click="sort(value)"
              v-bind:key="key"
              :class="{ first: key === 0 }">
              {{value | capitalize}}
              <i v-if="sortColDir === 'asc' && value === colKey"
                  class="inline-icon material-icons">keyboard_arrow_up</i>
              <i v-else-if="sortColDir === 'desc' && value === colKey"
                  class="inline-icon material-icons">keyboard_arrow_down</i>
              <i v-else class="inline-icon material-icons">unfold_more</i>
          </th>
          <th class="last"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, key) in sorted"
            v-bind:key="key">
          <td v-for="(column, key) in columns"
              v-html="filterData(data, column)"
              v-bind:key="key">{{data[column]}}
          </td>
          <td>
            <slot name="buttons" :data="data"></slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row" v-if="sorted.length && pagination">
      <div class="col s12 m6 l2 right" id="perPage">
        <div class="input-field col s5 m4 l4 right">
            <Select class="col s12"
                    :select="selectPerPage"
                    @selectedVal="selectedPerPage"/>
        </div>
        <p class="col s7 m8 l8 right right-align"> Items per page:</p>
      </div>
      <div class="col s12 m6 l6 left">
        <paginate
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

</template>
<script>
import Paginate from 'vuejs-paginate/src/components/Paginate';

export default {
  components: {
    paginate: Paginate,
  },
  data() {
    const sortOrders = {};
    Object.keys(this.request.columns).map((key) => {
      sortOrders[key] = 1;
      return sortOrders;
    });
    return {
      sortOrders,
      sortColDir: 'asc',
      search: this.$route.query.search || '',
      colKey: '',
      page: 1,
      lastPage: 0,
      perPage: 2,
      selectPerPage: {
        id: 'perPage_select',
        name: 'perPage',
        displayed: 'name',
        options: [
          {
            name: 5,
          },
          {
            name: 7,
          },
          {
            name: 10,
          },
          {
            name: 50,
          },
          {
            name: 100,
          },
        ],
        selected: {},
      },
    };
  },
  props: {
    request: {
      type: Object,
      required: true,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
  },
  filters: {
    capitalize(str) {
      const head = str.split('_').join(' ');
      return head.charAt(0).toUpperCase() + head.slice(1);
    },
  },
  methods: {

    getUser(key) {
      this.showModal = true;
      this.currentUser = key;
    },
    filterData(data, column) {
      const value = this.request.columns[column];

      if (typeof value === 'function') {
        return value(data);
      }
      if (typeof data[column] === 'object' && data[column] !== null) {
        return data[column][value];
      }
      return data[column];
    },
    sort(val) {
      this.colKey = val;
      this.sortColDir = this.sortColDir === 'asc' ? 'desc' : 'asc';
      this.sortOrders[val] *= -1;
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
    returnValue(data) {
      this.$emit('selectedRow', data);
    },
    checkType(data, key) {
      if (Date.parse(data) && data !== null) {
        const date = new Date(data);
        return date;
      }
      if (typeof data === 'object' && data !== null) {
        return data[this.request.columns[key]];
      }
      return data;
    },
  },
  computed: {
    columns() {
      return Object.keys(this.request.columns);
    },
    sorted() {
      const from = (this.page * this.perPage) - this.perPage;
      const to = (this.page * this.perPage);
      const { colKey } = this;
      const filterKey = this.search && this.search.toLowerCase();
      const order = this.sortOrders[colKey] || 1;
      let data = this.$store.getters[this.request.data];

      if (filterKey && data) {
        data = data.filter(row => Object.keys(row)
          .some(key => String(row[key])
            .toLowerCase()
            .indexOf(filterKey) > -1));
      }

      if (colKey && data) {
        data = data.slice().sort((c, d) => {
          const a = this.checkType(c[colKey], colKey);
          const b = this.checkType(d[colKey], colKey);
          if (a === b) {
            return 0 * order;
          } if (a > b) {
            return 1 * order;
          }
          return -1 * order;
        });
      }
      this.setLastPage(data);
      if (!this.pagination) {
        return data;
      }
      return data.slice(from, to);
    },
  },
  mounted() {
    const elems = document.querySelectorAll('select');
    this.$M.FormSelect.init(elems);
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

<style lang="scss" scoped>
    .inline-icon {
      vertical-align: bottom;
    }
    table {
      table-layout:fixed;
      th {
        white-space: nowrap;
        cursor: pointer;
      }
      td {
          overflow: hidden;
          text-overflow: ellipsis;
      }
      // .first,
      .last {
        width: 10%;
      }
    }
    .btn-floating {
      margin-right: 1rem;
    }
    .input-field.inline {
    width: 40px;
}
</style>
