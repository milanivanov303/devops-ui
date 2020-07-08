<template>
  <div class="table-component" >

    <div class="row" v-if="showTopRow()">
      <div class="input-field col s12 m6 l4">
        <i v-if="searchField" class="material-icons prefix">search</i>
        <input v-if="searchField" type="text" placeholder="Search..." v-model="currentFilter"/>
      </div>
      <div class="col s12 m6 l8">
        <slot name="top-actions-before" :rows="rows"></slot>
        <button
          class="btn-floating waves-effect waves-light right"
          title="Add"
          v-if="addBtn"
          @click="$emit('add')"
          >
          <i class="material-icons left">add</i>
        </button>
        <button
          class="btn-floating waves-effect waves-light right"
          title="Export"
          v-if="exportBtn"
          @click="$emit('export', rows)"
         >
          <i class="material-icons left">description</i>
        </button>
        <slot name="top-actions-after" :rows="rows"></slot>
      </div>
    </div>

    <table class="responsive-table">
      <thead>
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="index"
            :width="column.data.attrs.width"
            :class="column.data.staticClass"
          >
            <i
              class="left material-icons"
              v-if="column.componentOptions.propsData.info  "
              :data-tooltip="column.componentOptions.propsData.info"
            >
              info
            </i>
            <a
              href="#"
              v-if="column.componentOptions.propsData.sortable !== false"
              @click="
                setSort(
                  column.componentOptions.propsData.sortBy
                  ||
                  column.componentOptions.propsData.show,
                  $event
                )
              "
            >
              <span class="left">{{ getColumnHeader(column) }}</span>
              <i
                class="left material-icons"
                v-if="
                  column.componentOptions.propsData.sortBy === currentSortBy
                  ||
                  column.componentOptions.propsData.show === currentSortBy
                "
              >
                {{ currentSortDir === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
              </i>
            </a>
            <span v-else class="left">{{ getColumnHeader(column) }}</span>

          </th>
          <th v-if="showActionsColumn()">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in getPaginatedRows()" :key="index">
          <td
            v-for="(column, index) in columns"
            v-html="getColumnData(row, column.componentOptions.propsData.show)"
            :key="index"
            :class="column.data.staticClass"
          ></td>
          <td v-if="showActionsColumn()">
            <slot name="actions-before" :row="row"></slot>
            <a v-if="viewBtn" @click="$emit('view', row)" title="View">
              <i class="material-icons">view_list</i>
            </a>
            <a v-if="editBtn" @click="$emit('edit', row)" title="Edit">
              <i class="material-icons">edit</i>
            </a>
            <a v-if="deleteBtn" @click="$emit('delete', row)" title="Delete">
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
      <div class="col s12 m6 l6">
        <div class="input-field right">
          <select v-model.number="currentPerPage">
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>50</option>
            <option value="0">all</option>
          </select>
        </div>
        <p class="right">Items per page: </p>
      </div>
    </div>

  </div>
</template>

<script>
import Paginate from 'vuejs-paginate/src/components/Paginate';

export default {
  components: {
    Paginate,
  },
  props: {
    data: { default: () => [], type: Array },
    noDataText: { default: 'There are no records', type: String },
    searchField: { default: true, Boolean },
    addBtn: { default: true, type: Boolean },
    exportBtn: { default: true, type: Boolean },
    viewBtn: { default: true, type: Boolean },
    editBtn: { default: true, type: Boolean },
    deleteBtn: { default: true, type: Boolean },
    filter: { type: String },
    sortBy: { type: String },
    sortDir: { type: String },
    pagination: { default: true, type: Boolean },
    page: { default: 1, type: Number },
    perPage: { default: 10, type: Number },
    queryPrefix: { default: '', type: String },
  },
  data() {
    return {
      columns: [],
      currentFilter: this.filter,
      currentSortBy: this.sortBy,
      currentSortDir: this.sortDir,
      currentPage: this.page,
      currentPerPage: this.perPage,
      lastPage: 1,
    };
  },
  computed: {
    rows() {
      let { data } = this;

      if (this.currentFilter) {
        data = data.filter((row) => {
          const filter = this.currentFilter.toLowerCase();

          return Object.keys(row).some((key) => {
            const columnValue = String(row[key]).toLowerCase();

            return columnValue.indexOf(filter) > -1;
          });
        });
      }

      if (this.currentSortBy) {
        data = data.sort((a, b) => {
          const sortDir = this.currentSortDir === 'asc' ? 1 : -1;

          const dataA = this.getColumnData(a, this.currentSortBy);
          const dataB = this.getColumnData(b, this.currentSortBy);

          if (dataA > dataB) {
            return 1 * sortDir;
          }
          if (dataA < dataB) {
            return -1 * sortDir;
          }
          return 0;
        });
      }

      return data;
    },
  },
  methods: {
    getPaginatedRows() {
      if (!this.rows.length) {
        return this.rows;
      }

      if (this.currentPerPage === 0) {
        return this.rows;
      }

      this.lastPage = Math.ceil(this.rows.length / this.currentPerPage);

      if (this.currentPage > this.lastPage) {
        this.currentPage = this.lastPage;
      }

      const from = (this.currentPage * this.currentPerPage) - this.currentPerPage;
      const to = this.currentPage * this.currentPerPage;

      return this.rows.slice(from, to);
    },
    getColumnHeader(column) {
      if (column.componentOptions.propsData.label) {
        return column.componentOptions.propsData.label;
      }

      if (typeof column.componentOptions.propsData.show === 'string') {
        const label = column.componentOptions.propsData.show.split('_').join(' ');
        return label.charAt(0).toUpperCase() + label.slice(1);
      }

      return 'no-label';
    },
    getColumnData(row, show) {
      if (typeof show === 'function') {
        return show(row);
      }

      if (typeof row[show] === 'object' && row[show] !== null) {
        return row[show][show];
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
    modifyQueryParam(param, value) {
      const query = Object.assign({}, this.$route.query);

      if (value) {
        query[this.queryPrefix + param] = value;
      } else {
        delete query[this.queryPrefix + param];
      }

      this.$router.push({ query });
    },
    getQueryParam(param, _default = '') {
      return this.$route.query[this.queryPrefix + param] || _default;
    },
  },
  watch: {
    currentFilter() {
      this.currentPage = 1;
      this.modifyQueryParam('filter', this.currentFilter);
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
  },
  created() {
    const filter = this.getQueryParam('filter');
    if (filter) {
      this.currentFilter = filter;
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
      // delay current page setting as it gets reset to 1
      setTimeout(() => {
        this.currentPage = parseInt(page, 10);
      }, 50);
    }
  },
  mounted() {
    this.columns = this.$slots.default.filter(
      column => column.componentOptions && column.componentOptions.tag === 'Column',
    );
  },
  updated() {
    this.$M.FormSelect.init(this.$el.querySelectorAll('select'));
    this.$M.Tooltip.init(this.$el.querySelectorAll('[data-tooltip]'));
  },
};
</script>

<style type="text/scss" scoped>
  .input-field {
    width: 60px;
    margin-left: 15px;
  }
</style>
