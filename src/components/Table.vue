<template>
  <div class="table-component" >

    <div class="row" v-if="showTopRow()" id="top-row">
      <div class="col s12 m4 l6">
        <slot name="top-actions-before" :rows="rows"></slot>
        <button
          class="btn-floating waves-effect waves-light right"
          data-tooltip="Add"
          v-if="addBtn"
          @click="$emit('add')"
        >
          <i class="material-icons left">add</i>
        </button>
        <button
          class="btn-floating waves-effect waves-light right"
          data-tooltip="Export"
          v-if="exportBtn"
          @click="$emit('export', rows)"
        >
          <i class="material-icons left">description</i>
        </button>
        <slot name="top-actions-after" :rows="rows"></slot>
      </div>
      <div class="col s12 m8 l6">
        <TextInput id="tableSearch" v-if="searchField" icon="search" @input="debounceSearch"/>
      </div>
    </div>

    <table class="responsive-table">
      <thead>
      <tr>
        <th
          v-for="(column, index) in columns"
          :key="index"
          :width="column.attrs.width"
          :class="column.staticClass"
        >
          <i
            class="left material-icons"
            v-if="column.info"
            :data-tooltip="column.info"
          >
            info
          </i>
          <span v-if="column.sortable === false">{{ getColumnHeader(column) }}</span>
          <a v-else href="#" @click="setSort(column.name || column.show, $event)">
            <span class="left">{{ getColumnHeader(column) }}</span>
            <i
              class="left material-icons"
              v-if="column.name === currentSortBy || column.show === currentSortBy"
            >
              {{ currentSortDir === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
            </i>
          </a>
        </th>
        <th v-if="showActionsColumn()" class="actions">
          Actions
        </th>
      </tr>
      </thead>

      <thead v-if="showFiltersRow()">
      <tr class="filters">
        <td v-for="(column, index) in columns" :key="index">
          <TextInput
            v-if="column.filterType === 'search'"
            v-model="columnFilters[column.name || column.show]"
          />

          <Select
            v-if="column.filterType === 'dropdown'"
            :options="getColumnOptions(index)"
            :default-option-disabled="false"
            default-option-value=""
            default-option-text="all"
            v-model="columnFilters[column.name || column.show]"
          />
        </td>
        <td v-if="showActionsColumn()"></td>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td
          v-for="(column, index) in columns"
          v-html="getColumnData(row, column.show)"
          :key="index"
          :class="column.staticClass">
        </td>
        <td v-if="showActionsColumn()" class="actions">
          <slot name="actions-before" :row="row"></slot>
          <a v-if="viewBtn" @click="$emit('view', row)" data-tooltip="View">
            <i class="material-icons">view_list</i>
          </a>
          <a v-if="editBtn" @click="$emit('edit', row)" data-tooltip="Edit">
            <i class="material-icons">edit</i>
          </a>
          <a v-if="deleteBtn" @click="$emit('delete', row)" data-tooltip="Delete">
            <i class="material-icons">delete</i>
          </a>
          <slot name="actions-after" :row="row"></slot>
        </td>
      </tr>
      </tbody>

      <tbody v-if="!rows.length">
      <tr>
        <td :colspan="columns.length + 1">{{ noDataText }}</td>
      </tr>
      </tbody>
    </table>

    <div class="row" v-if="pagination">
      <div class="col s12 m6 l6">
        <Paginate
          v-if="lastPage > 1"
          v-model="currentPage"
          :page-count="lastPage"
          :prev-class="'material-icons'"
          :prev-text="'chevron_left'"
          :next-class="'material-icons'"
          :next-text="'chevron_right'"
          :container-class="'pagination'"
          :page-class="'waves-effect'"
          :disabled-class="'disabled'"
          :active-class="'active'">
        </Paginate>
      </div>
      <div class="col s12 m6 l6 right-align">
        Items per page:
        <Select
          :options="[5,10,20,30,50, 'all']"
          class="inline per-page"
          v-model="currentPerPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate/src/components/Paginate';
import TextInput from './TextInput';
import Select from './Select';

export default {
  components: {
    Paginate,
    TextInput,
    Select,
  },

  props: {
    data: { default: () => [], type: [Array, Function] },
    noDataText: { default: 'There are no records', type: String },
    searchField: { default: true, Boolean },
    addBtn: { default: true, type: Boolean },
    exportBtn: { default: true, type: Boolean },
    viewBtn: { default: true, type: Boolean },
    editBtn: { default: true, type: Boolean },
    deleteBtn: { default: true, type: Boolean },
    search: { type: String },
    sortBy: { type: String },
    sortDir: { type: String },
    pagination: { default: true, type: Boolean },
    page: { default: 1, type: Number },
    perPage: { default: 10, type: Number },
    queryPrefix: { default: '', type: String },
    apiDataTimeout: { default: 200, type: Number },
  },

  data() {
    return {
      columnFilters: {},
      columns: [],
      currentSearch: this.search,
      currentSortBy: this.sortBy,
      currentSortDir: this.sortDir,
      currentPage: this.page,
      currentPerPage: this.perPage,
      lastPage: 1,
      apiData: [],
    };
  },

  computed: {
    rows() {
      if (typeof this.data === 'function') {
        return this.apiData;
      }

      let rows = this.getFilteredRows(this.data);

      if (this.currentSortBy) {
        rows = this.getSortedRows(rows);
      }

      return this.getPaginatedRows(rows);
    },
  },

  methods: {
    debounceSearch(event) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.currentSearch = event;
      }, 600);
    },

    getApiData() {
      clearTimeout(this.loadDataTimeout);

      this.loadDataTimeout = setTimeout(() => {
        const payload = {};

        if (this.currentPerPage && this.currentPerPage !== 'all') {
          payload.page = this.currentPage;
          payload.per_page = this.currentPerPage;
        }

        if (this.currentSortBy) {
          const orders = {};
          orders[this.currentSortBy] = this.currentSortDir;
          payload.orders = JSON.stringify(orders);
        }

        if (this.currentSearch) {
          const filters = { anyOf: [] };
          this.columns.forEach((column) => {
            if (column.filterable === false) {
              return;
            }

            const filter = {};
            filter[column.name || column.show] = { operator: 'like', value: this.currentSearch };

            filters.anyOf.push(filter);
          });

          payload.filters = JSON.stringify(filters);
        }

        this.data(payload).then((response) => {
          this.apiData = response.data.data;
          if (response.data.meta) {
            this.lastPage = response.data.meta.last_page;
          }
        });
      }, this.apiDataTimeout);
    },

    getFilteredRows(rows) {
    if (this.currentSearch) {
      /* eslint no-param-reassign: "off" */
      rows = rows.filter((row) => {
        const filter = this.currentSearch.toLowerCase();
  
        return !!this.columns.find((column) => {
          let columnValue = this.getColumnData(row, column.show);
          columnValue = String(columnValue).toLowerCase();
  
          return columnValue.indexOf(filter) > -1;
        });
      });
    }
  
    if (Object.values(this.columnFilters).length === 0) {
      return rows;
    }
  
    Object.entries(this.columnFilters).forEach(([key, value]) => {
      const column = this.columns.find((column) => column.name === key || column.show === key);
  
      if (!column) {
        return;
      }
      if (column.filterType === 'dropdown') {
        /* eslint no-param-reassign: "off" */
        rows = rows.filter((row) => {
          const columnValue = this.getColumnData(row, column.show);
          if ((columnValue === null || columnValue === '') && (value === null || value === '')) {
            return true;
          }
          if (this.stripHtml(columnValue) === this.stripHtml(value)) {
            return true;
          }
          return false;
        });
      }
  
      if (column.filterType === 'search') {
        /* eslint no-param-reassign: "off" */
        rows = rows.filter((row) => {
          const columnValue = this.getColumnData(row, column.show);
          if (columnValue === null || columnValue === undefined) {
            return false;
          }
          const regExp = new RegExp(value, 'i');
          return columnValue.match(regExp);
        });
      }
    });
  
    return rows;
  },


    getSortedRows(rows) {
      const column = this.columns.find(
        (column) => column.name === this.currentSortBy || column.show === this.currentSortBy,
      );

      if (!column) {
        return rows;
      }

      return rows.sort((a, b) => {
        const sortDir = this.currentSortDir === 'asc' ? 1 : -1;

        const dataA = column.sortBy
          ? this.getSortByValue(a, column.sortBy) : this.getColumnData(a, column.show);
        const dataB = column.sortBy
          ? this.getSortByValue(b, column.sortBy) : this.getColumnData(b, column.show);

        if (dataA > dataB) {
          return 1 * sortDir;
        }
        if (dataA < dataB) {
          return -1 * sortDir;
        }
        return 0;
      });
    },
    getSortByValue(row, columnSortBy) {
      const props = columnSortBy.split('.');
      let sortByValue = row;
      props.forEach((p) => {
        sortByValue = sortByValue[p];
      });
      return sortByValue;
    },

    getPaginatedRows(rows) {
      if (!rows.length || this.currentPerPage === 0 || this.currentPerPage === 'all') {
        this.lastPage = 1;
        return rows;
      }

      this.lastPage = Math.ceil(rows.length / this.currentPerPage);

      if (this.currentPage > this.lastPage) {
        this.currentPage = this.lastPage;
      }

      const from = (this.currentPage * this.currentPerPage) - this.currentPerPage;
      const to = this.currentPage * this.currentPerPage;

      return rows.slice(from, to);
    },

    getColumnOptions(index) {
      const { data } = this;
      const options = [];
      const show = this.columns[index].show;

      data.forEach((row) => options.push(this.getColumnData(row, show)));

      return options.filter((key, idx) => options.indexOf(key) === idx);
    },

    convertLabelToCamelCase(label) {
      /* eslint no-param-reassign: "off" */
      label = label.split('_').join(' ');
      return label.charAt(0).toUpperCase() + label.slice(1);
    },

    stripHtml(value) {
      const div = document.createElement('DIV');
      div.innerHTML = value;
      return div.textContent || div.innerText || '';
    },

    getColumnHeader(column) {
      if (column.label) {
        return column.label;
      }

      if (column.name) {
        return this.convertLabelToCamelCase(column.name);
      }

      if (typeof column.show === 'string') {
        return this.convertLabelToCamelCase(column.show);
      }

      return 'no-label';
    },

    getColumnData(row, show) {
      if (typeof show === 'function') {
        return show(row);
      }

      return row[show];
    },

    setSort(sortBy, event) {
      event.preventDefault();

      if (this.currentSortBy === sortBy) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }

      if (this.currentSortBy !== sortBy) {
        this.currentSortDir = 'asc';
      }

      this.currentSortBy = sortBy;
    },

    showActionsColumn() {
      if (this.viewBtn || this.editBtn || this.deleteBtn) {
        return true;
      }
      if (this.$scopedSlots['actions-after']) {
        return true;
      }
      if (this.$scopedSlots['actions-before']) {
        return true;
      }
      return false;
    },

    showTopRow() {
      if (this.addBtn || this.exportBtn || this.searchField) {
        return true;
      }
      if (this.$scopedSlots['top-actions-before']) {
        return true;
      }
      if (this.$scopedSlots['top-actions-after']) {
        return true;
      }
      return false;
    },

    showFiltersRow() {
      if (typeof this.data === 'function') {
        return false;
      }

      const columns = this.columns.filter((column) => !!column.filterType);

      if (columns) {
        return true;
      }

      return false;
    },

    modifyQueryParam(param, value) {
      const query = { ...this.$route.query };

      if (typeof value === 'object') {
        Object.entries(this.columnFilters).forEach(([key, val]) => {
          if (!val) {
            delete value[key];
          }
          query[this.queryPrefix + param] = Object.keys(value).map((key) => `${key}=${this.stripHtml(value[key])}`).join('&');
        });
        if (!query[this.queryPrefix + param]) { delete query[this.queryPrefix + param]; }
      } else if (value || value === 0) {
        query[this.queryPrefix + param] = value;
      } else {
        delete query[this.queryPrefix + param];
      }

      this.$router.history.replace({ query });

      if (typeof this.data === 'function') {
        this.getApiData();
      }
    },

    getQueryParam(param, _default = '') {
      const queryParam = this.$route.query[this.queryPrefix + param];

      if (typeof queryParam !== 'undefined' && queryParam.includes('=')) {
        const obj = {};

        queryParam.split('&').forEach((query) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: false}}] */
          obj[query.split('=')[0]] = query.split('=')[1];
        });

        return obj;
      }

      return this.$route.query[this.queryPrefix + param] || _default;
    },
  },

  watch: {
    currentSearch() {
      this.currentPage = 1;
      this.modifyQueryParam('search', this.currentSearch);
      if (document.getElementById('tableSearch')) {
        document.getElementById('tableSearch').value = this.currentSearch;
      }
    },
    columnFilters: {
      deep: true,
      handler() {
        this.currentPage = 1;
        this.modifyQueryParam('filters', this.columnFilters);
      },
    },
    currentSortBy() {
      this.currentPage = 1;
      this.modifyQueryParam('sort_by', this.currentSortBy);
    },
    currentSortDir() {
      this.currentPage = 1;
      this.modifyQueryParam('sort_dir', this.currentSortDir);
    },
    currentPage() {
      this.modifyQueryParam('page', this.currentPage);
    },
    currentPerPage() {
      this.modifyQueryParam('per_page', this.currentPerPage);
    },
  },

  created() {
    if (typeof this.data === 'function') {
      this.getApiData();
    }

    const search = this.getQueryParam('search');
    if (search) {
      this.currentSearch = search;
    }

    const filters = this.getQueryParam('filters');
    if (filters) {
      this.columnFilters = filters;
    }

    const sortBy = this.getQueryParam('sort_by');
    if (sortBy) {
      this.currentSortBy = sortBy;
    }

    const sortDir = this.getQueryParam('sort_dir');
    if (sortDir) {
      this.currentSortDir = sortDir;
    }

    const page = this.getQueryParam('page');
    if (page) {
      this.currentPage = parseInt(page, 10);
    }

    const perPage = this.getQueryParam('per_page');
    if (perPage) {
      this.currentPerPage = parseInt(perPage, 10) || 'all';
    }
  },

  mounted() {
    this.columns = this.$slots.default
      .filter(
        (column) => column.componentOptions && column.componentOptions.tag === 'Column',
      )
      .map((column) => ({ ...column.componentOptions.propsData, ...column.data }));
  },

  updated() {
    this.$M.Tooltip.init(this.$el.querySelectorAll('[data-tooltip]'));
  },
};
</script>

<style lang="scss" scoped>
#top-row {
  .col {
    float: right !important;

    button {
      margin-left: 5px;
    }
  }
}
.per-page {
  width: 80px;
}

tr.filters {
  td {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>