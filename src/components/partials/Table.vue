<template>
  <div>
    <div class="row">
      <div class="input-field col s12 m6 l6" v-if="sorted.length">
        <i class="material-icons prefix">search</i>
        <input type="text"
               v-if="request.searchable === true"
               @input="selectedPage(1)"
               v-model="search"
               placeholder="Search..">
      </div>
    </div>
    <div class="col s12 m6 l6 right">
      <button class="btn modal-triger right"
              v-if="request.add === true"
              @click="$emit('add')"
              data-target="action"><i class="material-icons left">add</i> Add new
      </button>
      <button class="btn-floating waves-effect waves-light right"
              v-if="request.export === true"
              data-target="action"><i class="material-icons left">description</i>
      </button>
    </div>
    <table v-if="sorted.length" class="responsive-table">
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
          <td v-for="(value, key) in columns"
              v-html="filterData(data[value], request.columns[value])"
              v-bind:key="key">{{data[value]}}
          </td>
          <td>
            <slot name="buttons" :data="data"></slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div class="col s12 m6 l6 right right-align">
        <div class="input-field inline">
          <select v-model="perPage">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
        Items per page
      </div>
      <div class="col s12 m6 l6 left left-align">
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
      search: '',
      colKey: '',
      perPage: 10,
      page: 1,
      lastPage: 0,
    };
  },
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  filters: {
    capitalize(str) {
      const head = str.split('_').join(' ');
      return head.charAt(0).toUpperCase() + head.slice(1);
    },
  },
  methods: {
   
    getUser (key) {
      this.showModal = true;
      this.currentUser = key;
    },
    filterData(data, column) {
      if (typeof column === 'function') {
        return column(data);
      }
      if (typeof data === 'object' && data !== null) {
        return data[column];
      }
      return data;
    },
    sort(val) {
      this.colKey = val;
      this.sortColDir = this.sortColDir === 'asc' ? 'desc' : 'asc';
      this.sortOrders[val] = this.sortOrders[val] * -1;
    },
    selectedPage(page) {
      this.page = page;
    },
    setLastPage(data) {
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
        if (data.length === 0) {
          data = this.$store.getters[this.request.data];
        }
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
      return data.slice(from, to);
    },
  },
  mounted() {
    var elems = document.querySelectorAll('select');
    this.$M.FormSelect.init(elems);
  }
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
      .first, .last {
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
