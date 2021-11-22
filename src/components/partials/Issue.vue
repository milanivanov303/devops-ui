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
              v-model.trim="formData.ttsKey"
              @blur="$v.formData.ttsKey.$touch()"
              @change="$v.formData.ttsKey.$touch()"
          />
          <div class="validator" v-if="$v.formData.ttsKey.$anyError || formData.submitStatus === 'ERROR'">
            <div class="red-text" v-if="!$v.formData.ttsKey.required">
              <p>Field is required</p>
            </div>
            <div class="red-text" v-if="!$v.formData.ttsKey.validKey">
              <p>Not a valid TTS key.</p>
            </div>
            <div class="red-text" v-if="formData.submitStatus === 'ERROR'">
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
    formData: {
      type: Object,
    }
  },
  data() {
    return {
      ttsKey: this.$route.params.issue,
      submitStatus: '',
      issueId: '',
      deliveryChains: [],
      deliveryChain: {},
    }
  },
  watch: {
    'formData.ttsKey'(key) {
      this.formData.submitStatus = '';
      this.formData.deliveryChains = [];
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
    formData: {
      ttsKey: {
        required,
        validKey(value) {
          return /^[A-Z]+-[0-9]+$/.test(value);
        },
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
              this.formData.issueId = this.$store.state.cms.issue.id;
              if (this.$store.state.cms.issue) {
                this.formData.deliveryChains = this.$store.state.cms.issue.project.delivery_chains;
              }
              if (!this.$store.state.cms.issue
                  || (this.formData.ttsKey !== this.$store.state.cms.issue.tts_id)) {
                this.formData.submitStatus = 'ERROR';
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
