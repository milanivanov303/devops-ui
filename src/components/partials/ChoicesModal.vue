<template>
  <div @submit.prevent="onSubmit" id="choices" ref="choices" class="modal">
    <div class="modal-content">
      <form>
        <div>
          <table class="highlight">
            <thead>
              <tr>
                <th class="icon"></th>
                <th v-for="(value, key) in data.columns"
                  v-bind:key="key">
                  {{value | capitalize}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(option, key) in data.options"
                  v-bind:key="key"
                  @click="onSubmit(option)"
                  class="content"
                  @mouseover="active = key"
                  @mouseleave="active = null">
                  <td class="icon">
                    <i v-if="active === key" class="material-icons">fiber_manual_record</i>
                    <i v-else class="material-icons">radio_button_unchecked</i>
                  </td>
                  <td v-for="(value, key) in data.columns"
                      v-bind:key="key">{{option[value]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .modal {
    width: 60%;
  }
  table.highlight>tbody>tr:hover {
    background-color: #C8DBDC;
  }

  table {
    table-layout:fixed;

    .icon {
      width: 4%;
      font-weight: 500;
    }

    .content {
      cursor: pointer;
    }

    .material-icons {
      font-size: 0.8em;
    }

    thead {
      color: #525f6d;
    }

    td {
      word-break: break-all;
    }
  }
</style>
<script>
export default {
  mounted() {
    this.openModal();
  },
  data() {
    return {
      active: null,
    };
  },
  props: {
    data: {
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
    onSubmit(selected) {
      this.$emit('selectedVal', selected);
      this.$M.Modal.init(this.$refs.choices).close();
    },
    openModal() {
      this.$M.Modal.init(this.$refs.choices, {
        dismissible: true,
        preventScrolling: false,
        onCloseEnd: this.$emit('selectedVal', null),
      }).open();
    },
  },
};
</script>
