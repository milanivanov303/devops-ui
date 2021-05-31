<template>
  <Paginate
    v-model="page"
    :page-count="pageCount"
    :prev-class="'material-icons'"
    :prev-text="'chevron_left'"
    :next-class="'material-icons'"
    :next-text="'chevron_right'"
    :container-class="'pagination'"
    :page-class="'waves-effect'"
    :disabled-class="'disabled'"
    :active-class="'active'"
    :click-handler="(selected) => $emit('input', selected)"
  />
</template>

<script>
import Paginate from 'vuejs-paginate/src/components/Paginate';

export default {
  components: {
    Paginate,
  },

  props: {
    value: Number,
    pageCount: Number,
  },

  data() {
    return {
      page: this.value,
    };
  },

  watch: {
    value() {
      this.page = this.value;
    },
  },
};
</script>
