<template>
  <div @submit.prevent="onSubmit" id="action" ref="artifacts" class="modal">
    <div class="modal-content">
      <form>
        <div>
          <table class="highlight">
            <thead>
            <tr>
              <th class="icon"></th>
              <th class="second">NAME</th>
              <th class="second">PATH</th>
              <th class="last">REPO</th>
              <th class="last">MODIFIED</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(artifactory, key) in artifactoryArr"
                v-bind:key="key"
                @click="onSubmit(artifactory)"
                class="content"
                @mouseover="active = key"
                @mouseleave="active = null">
              <td class="icon">
                <i v-if="active === key" class="material-icons">fiber_manual_record</i>
                <i v-else class="material-icons">radio_button_unchecked</i>
              </td>
              <td class="second"><b>{{artifactory.name}}</b></td>
              <td class="second small-font-size">{{artifactory.path}}</td>
              <td class="last small-font-size">{{artifactory.repo}}</td>
              <td class="last small-font-size">{{modified(artifactory)}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import 'vue-datetime/dist/vue-datetime.css';
import { DateTime } from 'luxon';

export default {
  data() {
    return {
      active: null,
    };
  },
  props: {
    artifactoryArr: {
      type: Array,
      required: true,
    },
  },
  methods: {
    modified(artifactory) {
      return DateTime.fromISO(artifactory.modified).toFormat('yyyy-MM-dd H:m:ss');
    },
    onSubmit(artifactory) {
      this.$emit('selectedVal', artifactory);
      this.$M.Modal.init(this.$refs.artifacts).close();
    },
    openModal() {
      this.$M.Modal.init(this.$refs.artifacts, {
        dismissible: true,
        preventScrolling: false,
        onCloseEnd: this.$emit('selectedVal', false),
      }).open();
    },
  },
};
</script>
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

  .second {
    width: 30%;
  }

  .last {
    width: 15%;
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

  .small-font-size {
    font-size: 13px;
  }

}
</style>
