<template>
  <Modal class="right-sheet" @close="$emit('close')">
    <template v-slot:header>
        Build configuration
    </template>
    <template v-slot:content>
      <form>
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
      </form>
    </template>
    <template v-slot:footer>
      <button
          class="btn waves-effect waves-light"
          type="button"
          name="action"
          @click="buildConfiguration()">
           Build
      </button>
    </template>
  </Modal>
</template>
<script>
import { required, requiredIf } from 'vuelidate/lib/validators';
// import client from '@/plugins/ws';
import _ from 'lodash';

import TextArea from '@/components/TextArea';

export default {
  components: {
    TextArea,
  },
  props: {
    configuration: {},
    action: String,
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
      build: {
        started: false,
        status: '',
        summary: '',
        progress: null,
        log: '',
        error: null,
      },
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
    buildConfiguration() {
      // this.build.started = true;
      // this.build.summary = 'Build will start shortly ...';
      //
      // const payload = {
      //   instance: this.configuration.dev_instance,
      //   deploy_instance: this.configuration.deploy_instance,
      //   client: this.clients.find((client) => client.package === this.configuration.prefix),
      // };
      //
      // this.$store.dispatch('extranet/buildConfiguration', {
      //   id: this.configuration.id,
      //   payload,
      // })
      //   .then((response) => {
      //     this.build.status = 'running';
      //
      //     if (!client.connected) {
      //       return;
      //     }
      //
      //     const subscribe = client.subscribe(
      //       `/queue/${response.data.broadcast.queue}`,
      //       (message) => {
      //         const data = JSON.parse(message.body);
      //
      //         if (data.summary) {
      //           this.build.summary = data.summary;
      //         }
      //         this.build.progress = data.progress || null;
      //
      //         if (data.log) {
      //           this.build.log += data.log;
      //           this.scrollLogContainer();
      //         }
      //
      //  if (data.status === 'failed' || (data.action === 'deploy' && data.status !== 'running')) {
      //           this.build.status = data.status;
      //           subscribe.unsubscribe();
      //         }
      //       },
      //       response.data.broadcast,
      //     );
      //   })
      //   .catch((error) => {
      //     this.build.status = 'failed';
      //     this.build.summary = 'Could not start build';
      //     if (error.response.status === 403) {
      //       this.build.error = 'You do not have insufficient rights to create build';
      //     } else {
      //       this.build.error = error;
      //     }
      //   });
    },
    scrollLogContainer() {
      setTimeout(() => {
        const container = this.$el.querySelector('.log');
        container.scrollTop = container.scrollHeight;
      }, 100);
    },
  },
  created() {
    this.$store.dispatch('mmpi/getBinaryTypes');
    this.$store.dispatch('mmpi/getHashes');
  },
};
</script>
