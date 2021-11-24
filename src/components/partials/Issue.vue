<template>
  <div @submit.prevent="getIssue" ref="select-issue">
    <form>
      <div class="row">
        <div class="input-field col s10">
          <i class="material-icons prefix">label_outline</i>
          <label for="tts_key" class="active">TTS Key</label>
          <input
              id="tts_key"
              type="text"
              v-model.trim="formTtsKey"
              @blur="$v.formTtsKey.$touch()"
              @change="$v.formTtsKey.$touch()"
          />
          <div class="validator" v-if="$v.formTtsKey.$anyError || submitStatus === 'ERROR'">
            <div class="red-text" v-if="!$v.formTtsKey.required">
              <p>Field is required</p>
            </div>
            <div class="red-text" v-if="!$v.formTtsKey.validKey">
              <p>Not a valid TTS key.</p>
            </div>
            <div class="red-text" v-if="submitStatus === 'ERROR'">
              <p>TTS Key does not exist in MMPI!</p>
            </div>
          </div>
        </div>
        <div class="input-field col s1">
          <a
            class="btn-floating btn-small waves-effect waves-light tooltipped"
            data-position="right"
            data-tooltip="Change issue"
            ref="tooltip"
            @click="getIssue()"
          >
          <i class="material-icons">cached</i>
          </a>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    deliveryChains: {
      type: Array,
    },
    ttsKey: {
      type: String,
      required: true,
    },
    issueStatus: {
      type: String,
    },
    se: {
      type: Object,
    },
  },
  data() {
    return {
      formTtsKey: this.ttsKey,
      submitStatus: this.issueStatus,
      formDeliveryChains: this.deliveryChains,
      issueId: this.se.issue_id,
    }
  },
  watch: {
    formTtsKey(key) {
      this.submitStatus = '';
      this.formDeliveryChains = [];
      this.$router.history.replace({ params: { issue: key } });
    },
  },
  computed: {
    issue() {
      return '';
    },
  },
  mounted() {
    this.getIssue();
  },
  validations: {
    formTtsKey: {
      required,
      validKey(value) {
        return /^[A-Z]+-[0-9]+$/.test(value);
      },
    },
  },
  methods: {
    // async getIssue() {
    //
    //   this.$emit('changeIssue');
    //
    //   this.$v.$touch();
    //   if (this.$v.$invalid) {
    //     return;
    //   }
    //
    //   const loader = this.$loading.show({ container: this.$el });
    //
    //   await this.$store.dispatch('cms/getIssue', this.formData.ttsKey).then(() => {
    //               loader.hide();
    //             });
    //
    //   const { issue } = this.$store.state.cms;
    //
    //   if (!issue || (this.formData.ttsKey !== issue.tts_id)) {
    //     this.submitStatus = 'ERROR';
    //     this.$router.push(`/cms/${this.$route.meta.name}`);
    //     return;
    //   }
    //
    //   this.$router.push(`/cms/${this.$route.meta.name}/${issue.tts_id}`);
    //   this.$M.Modal.init(this.$refs['select-issue']).close();
    // },
    // changeStatus() {
    //   this.submitStatus = 'OK';
    // },
    async getIssue() {
      this.$emit('changeIssue');
        if (this.$route.params.issue) {
        const loader = this.$loading.show({ container: this.$el });
        await this.$store.dispatch('cms/getIssue', this.$route.params.issue)
         .then(() => {
          this.issueId = this.$store.state.cms.issue.id;
          if (this.$store.state.cms.issue) {
            this.formDeliveryChains = this.$store.state.cms.issue.project.delivery_chains;
          }
          if (!this.$store.state.cms.issue
              || (this.formTtsKey !== this.$store.state.cms.issue.tts_id)) {
            this.submitStatus = 'ERROR';
          }
          loader.hide();
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
