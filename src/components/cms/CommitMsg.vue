<template>
  <div @submit.prevent="onSubmit" id="action" ref="commit-msg" class="modal">
    <div class="frame">
      <div class="modal-content">
        <form>
          <h6 class="center">COMMIT MESSAGE</h6>
          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">label_outline</i>
              <label for="tts_key" class="active">TTS Key</label>
              <input id="tts_key"
                     type="text"
                     v-model="commitMsg.ttsKey"
                     @blur="$v.commitMsg.ttsKey.$touch()">
              <div class="validator" v-if="$v.commitMsg.ttsKey.$anyError">
                <div class="red-text" v-if="!$v.commitMsg.ttsKey.required">
                  <p>Field is required</p>
                </div>
                <div class="red-text" v-if="!$v.commitMsg.ttsKey.validKey">
                  <p>Not a valid TTS key.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s6">
              <i class="material-icons prefix">label_outline</i>
              <label for="func_changes" class="active">Func Changes</label>
              <input id="func_changes"
                     type="text"
                     v-model="commitMsg.funcChanges"
                     @blur="$v.commitMsg.funcChanges.$touch()">
              <div class="validator" v-if="$v.commitMsg.funcChanges.$anyError">
                <div class="red-text" v-if="!$v.commitMsg.funcChanges.required">
                  <p>Field is required</p>
                </div>
              </div>
            </div>
            <div class="input-field col s6">
              <i class="material-icons prefix">label_outline</i>
              <label for="tech_changes" class="active">Tech Changes</label>
              <input id="tech_changes"
                     type="text"
                     v-model="commitMsg.techChanges"
                     @blur="$v.commitMsg.techChanges.$touch()">
              <div class="validator" v-if="$v.commitMsg.techChanges.$anyError">
                <div class="red-text" v-if="!$v.commitMsg.techChanges.required">
                  <p>Field is required</p>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <button class="btn waves-effect waves-light right"
                      type="submit"
                      name="action">
                      SUBMIT</button>
            </div>
            <div class="input-field col s12 m6 l6">
              <a href="#!"
                @click="cancel"
                class="modal-close waves-effect waves-blue btn-flat left">Close</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  p {
    text-align: center;
  }
</style>
<script>
import { required } from 'vuelidate/lib/validators';

export default {
  mounted() {
    this.$M.Modal.init(this.$refs['commit-msg'], {
      dismissible: false,
      preventScrolling: false,
    }).open();
  },
  data() {
    return {
      commitMsg: {
        ttsKey: '',
        techChanges: '',
        funcChanges: '',
      },
    };
  },
  validations: {
    commitMsg: {
      ttsKey: {
        required,
        validKey(value) {
          return /^[A-Z]+-[0-9]+$/.test(value);
        },
      },
      funcChanges: {
        required,
      },
      techChanges: {
        required,
      },
    },
  },
  methods: {
    cancel() {
      this.$emit('selectedVal', false);
      this.$M.Modal.init(this.$refs['commit-msg']).close();
    },
    onSubmit() {
      this.$emit('selectedVal', this.commitMsg);
      this.$M.Modal.init(this.$refs['commit-msg']).close();
    },
  },
};
</script>
