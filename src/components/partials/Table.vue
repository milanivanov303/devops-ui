<template>
    <div>
        <input type="text" value="" v-model="search" placeholder="Search">
        <table class="responsive-table">
            <thead>
            <tr>
                <th v-for="(value, key) in head"
                    @click="sort(value)"
                    v-bind:key="key"
                    :class="{sorted: sortCol === value}">
                    <i v-if="sortCol === value" class="inline-icon material-icons">arrow_drop_up</i>
                    <i v-else class="inline-icon material-icons">arrow_drop_down</i>
                    {{value}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(data, key) in sorted"
                v-bind:key="key">
                <td v-for="(value, key) in data"
                    v-bind:key="key">{{value}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      sortCol: '',
      sortColDir: 'asc',
      search: '',
    };
  },
  props: {
    request: {
      type: Object,
      required: true,
    },
  },
  methods: {
    sort(col) {
      if (col === this.sortCol) {
        this.sortColDir = this.sortColDir === 'asc' ? 'desc' : 'asc';
      }
      this.sortCol = col;
    },
  },
  computed: {
    head() {
      const headVal = this.$store.getters[this.request.head];
      if (headVal.length) {
        headVal.forEach(item => this.request.columns.forEach(e => delete item[e]));

        const keys = [];
        Object.keys(headVal[0]).forEach((element) => {
          const key = element.split('_').join(' ');
          keys.push(key);
        });
        return keys;
      }
      return headVal;
    },
    body() {
      return this.$store.getters[this.request.body];
    },
    sorted() {
      return this.body.filter(a => (`${a[this.request.searchBy]}''`).includes(this.search))
        .sort((a, b) => {
          let modifier = 1;
          if (this.sortColDir === 'desc') modifier = -1;
          if (a[this.sortCol] < b[this.sortCol]) return -1 * modifier;
          if (a[this.sortCol] > b[this.sortCol]) return 1 * modifier;
          return 0;
        });
    },
  },
  async mounted() {
    await this.$store.dispatch(this.request.action);
  },
};
</script>

<style scoped>
    .inline-icon {
        vertical-align: bottom;
    }
    .sorted {
        color: green;
    }
</style>
