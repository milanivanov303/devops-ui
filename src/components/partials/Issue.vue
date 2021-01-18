<template>
  <div>
    <div ref="select-issue" id="modal" class="modal right-sheet">
      <div class="modal-content">
        <h2 class="center">Select issue</h2>
        <div class="card codix base">
          <div class="card-content white-text">
            <p>Search is only among issues with modifs, requests or patches.
               To search all issues and create them into the system, please use TTS.</p>
          </div>
        </div>
        <form @submit.prevent="getIssue">
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">label_outline</i>
              <label for="tts_key" class="active">TTS Key</label>
              <input id="tts_key"
                     type="text"
                     v-model.trim="formData.ttsKey"
                     @blur="$v.formData.ttsKey.$touch()"
                     @change="changeStatus()">
              <div class="validator"
                   v-if="$v.formData.ttsKey.$anyError || submitStatus === 'ERROR'">
                <div class="red-text" v-if="!$v.formData.ttsKey.required">
                  <p>Field is required</p>
                </div>
                <div class="red-text" v-if="!$v.formData.ttsKey.validKey">
                  <p>Not a valid TTS key.</p>
                </div>
                <div class="red-text" v-if="submitStatus === 'ERROR'">
                  <p>TTS Key does not exist!</p>
              </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <button class="btn waves-effect waves-light right"
                      type="submit"
                      @click="$emit('selectIssue');"
                      name="action">Select</button>
            </div>
            <div class="input-field col s12 m6 l6">
              <a href="#!"
                 class="modal-close waves-effect waves-blue btn-flat left">Close</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      formData: {
        ttsKey: '',
      },
      submitStatus: 'OK',
    };
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
    openModal() {
      this.$M.Modal.init(this.$refs['select-issue'], {
        dismissible: false,
        preventScrolling: false,
      }).open();
    },
    async getIssue() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const loader = this.$loading.show({ container: this.$refs['select-issue'] });

      await this.$store.dispatch('cms/getIssue', this.formData.ttsKey).then(() => {
        loader.hide();
      });

      const { issue } = this.$store.state.cms;

      if (!issue || (this.formData.ttsKey !== issue.tts_id)) {
        this.submitStatus = 'ERROR';
        this.$router.push(`/cms/${this.$route.meta.name}`);
        return;
      }

      this.$router.push(`/cms/${this.$route.meta.name}/${issue.tts_id}`);
      this.$M.Modal.init(this.$refs['select-issue']).close();
    },
    changeStatus() {
      this.submitStatus = 'OK';
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
