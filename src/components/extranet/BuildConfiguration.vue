<template>
  <Modal @close="closeAddEditModal()" class="right-sheet">
    <template v-slot:header>
      Build configuration
    </template>
    <template v-slot:content>
      <form @submit.prevent="handleSubmit">
<!--    <div class="row">-->
<!--      <tts-key></tts-key>-->
<!--    </div>-->
    <div class="row">
      <div class="input-field col s12">
        <i class="material-icons prefix">label_outline</i>
          <label class="active">TTS Key</label>
          <input
            id="tts_key"
            type="text"
            v-model.trim="ttsKey"
            :invalid="$v.ttsKey.$error"
            @keyup="debouncedIssue()"
            @blur="$v.ttsKey.$touch()"
          />
        <div class="validator"
           v-if="$v.ttsKey.$anyError || issueStatus === 'ERROR'">
          <div class="red-text" v-if="!$v.ttsKey.required">
             <p>Field is required</p>
          </div>
          <div class="red-text" v-if="!$v.ttsKey.validKey">
             <p>Not a valid TTS key.</p>
          </div>
          <div class="red-text" v-if="issueStatus === 'ERROR'">
             <p>TTS Key does not exist in MMPI!</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <Select
          class="col s12"
          label="Define Binary Type"
          icon="transform"
          displayed="value"
          v-model="binaryType"
          :options="binaryTypes"
      />
    </div>
    <div class="row">
      <div class="input-field col s12" v-if="binaryType.value === 'Manual'">
        <i class="material-icons prefix">more_vert</i>
        <label class="active">Enter Config Name</label>
        <input
            type="text"
            v-model="configName"
        />
        <div class="validator col s12">
          <div class="red-text" v-if="$v.configName.$error">
            <p>FE hash field must not be empty.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <Select
          class="col s6 test"
          label="Run Repack"
          icon="details"
          displayed="name"
          v-model="repack"
          :options="repackOpt"
      />
      <div></div>
      <div class="col s6"></div>
      <label for="repack-only">
        <input
            class="filled-in col s6"
            type="checkbox"
            id="repack-only"
            :disabled="repack.name !== 'Yes'"
            name="repack-only"
            v-model="repack_only"/>
        <span>Repack Only</span>
      </label>
    </div>
    <div class="row">
      <text-area
          class="col s12"
          type="text"
          label="Comments"
          v-model="comments"
          display="name"
          icon="comment">
      </text-area>
    </div>
    <div>
      <h6 class="center">CHOOSE HASH</h6>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="FE Hash"
            icon="devices"
            valueKey="hash_rev"
            :items="feHashes"
            v-model="feHash"
            :invalid="$v.feHash.$error"
            @blur="$v.feHash.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.feHash.$error">
              <p v-if="!$v.feHash.required">FE hash field must not be empty.</p>
            </div>
          </div>
          <div class="row" v-if="feHash">
            <div class="col s12">
              <p>Description: {{ feHash.description }}</p>
              <p>Made On: {{feHash.made_on}}</p>
            </div>
          </div>
        </div>
        <div class="row">
          <Autocomplete
            class="col s12"
            label="BE Hash"
            icon="aspect_ratio"
            valueKey="hash_rev"
            :items="beHashes"
            v-model="beHash"
            :invalid="$v.beHash.$error"
            @blur="$v.beHash.$touch()"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.beHash.$error">
              <p v-if="!$v.beHash.required"> BE hash field must not be empty.</p>
            </div>
          </div>
          <div class="row" v-if="beHash">
            <div class="col s12">
              <p>Description: {{ beHash.description }}</p>
              <p>Made On: {{beHash.made_on}}</p>
            </div>
          </div>
        </div>
    </div>
    <div class="form-group">
      <button class="btn btn-primary">Submit</button>
    </div>
  </form>
    </template>
  </Modal>
</template>
<script>
import { required, requiredIf } from 'vuelidate/lib/validators';
import _ from 'lodash';

import TextArea from '@/components/TextArea';
// import TtsKey from '@/components/extranet/TtsKey';

export default {
  name: 'build-configuration',
  components: {
    // TtsKey,
    TextArea,
  },
  data() {
    return {
      binaryType: '',
      configName: '',
      repack: '',
      repackOpt: [
        {
          name: 'Yes',
        },
        {
          name: 'No',
        },
      ],
      repack_only: false,
      comments: '',
      feHash: '',
      beHash: '',
      ttsKey: this.$route.params.issue,
      issueStatus: '',
      issue_id: '',
      debouncedIssue: _.debounce(() => {
        if (!/^[A-Z]+-[0-9]+$/.test(this.ttsKey)) {
          return;
        }
        this.getIssue();
      }, 2000),
    };
  },
  watch: {
    ttsKey(key) {
      this.issueStatus = '';
      this.$router.history.replace({ params: { issue: key } });
      if (this.$v.$invalid) {
        return;
      }
      this.getIssue();
    },
  },
  computed: {
    feHashes() {
      return this.$store.getters['mmpi/hashesByType']('imx_fe');
    },
    beHashes() {
      return this.$store.getters['mmpi/hashesByType']('imx_be');
    },
    binaryTypes() {
      return this.$store.state.mmpi.binaryTypes;
    },
    configNameRequired() {
      return requiredIf(this.binaryTypes.value === 'Manual');
    },
  },
  validations: {
    configName: {
      required: requiredIf((formModel) => formModel.binaryType.value === 'Manual'),
    },
    feHash: {
      required,
    },
    beHash: {
      required,
    },
    ttsKey: {
      required,
      validKey(value) {
        return /^[A-Z]+-[0-9]+$/.test(value);
      },
    },
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      // to submit to build process
      console.log('submit');
    },
    async getIssue() {
      if (this.$route.params.issue) {
        this.ttsKey = this.$route.params.issue;
      }

      await this.$store.dispatch('cms/getIssue', this.ttsKey)
        .then(() => {
          this.issue_id = this.$store.state.cms.issue.id;
          if (!this.$store.state.cms.issue
              || (this.ttsKey !== this.$store.state.cms.issue.tts_id)) {
            this.issueStatus = 'ERROR';
          }
        });
    },
  },
  created() {
    this.$store.dispatch('mmpi/getBinaryTypes');
    this.$store.dispatch('mmpi/getHashes');
  },
};
</script>
