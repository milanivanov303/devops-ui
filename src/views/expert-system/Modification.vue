<template>
  <div class="row">
    <h1 class="center">SE Transfer</h1>
    <custom-confirm
      ref="custom-confirm"
      :message="confirmMsg"
      @selectedVal="customConfirm"
    />
    <div class="col s6">
      <Alert
        v-if="error !== ''"
        v-bind:msg="error"
      />
      <div class="row">
        <div class="input-field col s10">
          <i class="material-icons prefix">label_outline</i>
          <label for="tts_key" class="active">TTS Key</label>
          <input
            id="tts_key"
            type="text"
            v-model.trim="ttsKey"
            @blur="$v.ttsKey.$touch()"
            @change="$v.ttsKey.$touch()"
          />
          <div class="validator" v-if="$v.ttsKey.$anyError || issueStatus === 'ERROR'">
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
        <div class="input-field col s1">
          <a
            class="btn-floating btn-small waves-effect waves-light tooltipped"
            data-position="right"
            data-tooltip="Change issue"
            ref="tooltip"
            @click="getIssue()">
            <i class="material-icons">cached</i>
          </a>
        </div>
      </div>
<!--        <Issue-->
<!--            ref="select-issue"-->
<!--            @changeIssue="changeIssue"-->
<!--            :formTtsKey="ttsKey"-->
<!--            :formDeliveryChains="deliveryChains"-->
<!--            :submitStatus="issueStatus">-->
<!--        </Issue>-->
      <div class="row"
           v-if="deliveryChains.length
           && !$v.ttsKey.$anyError
           && issueStatus !== 'ERROR'">
      <div class="col s11">
          <Select
              label="Delivery chains"
              icon="linear_scale"
              displayed="title"
              v-model="deliveryChain"
              :options="deliveryChains"
              :invalid="$v.deliveryChain.$error"
              @blur="$v.deliveryChain.$touch()"
              @change="selectedDeliveryChain"
          />
          <div class="validator red-text" v-if="$v.deliveryChain.$error">
            <p v-if="!$v.deliveryChain.required">Delivery chain field is required.</p>
          </div>
        </div>
      </div>
      <div class="row" v-if="se.delivery_chain">
        <div class="col s11">
          <Select
              label="Instance status"
              icon="power_settings_new"
              displayed="value"
              v-model="defaultValue"
              :options="instanceStatuses"
              :invalid="$v.instanceStatus.$error"
              @blur="$v.instanceStatus.$touch()"
              @change="selectedInstanceStatus"
          />
          <div class="validator red-text" v-if="$v.instanceStatus.$error">
            <p v-if="!$v.instanceStatus.required">Instance status field is required.</p>
          </div>
        </div>
      </div>
      <div class="row"  v-if="se.delivery_chain">
        <div class="col s11">
          <Select
              label="SE Type"
              icon="memory"
              displayed="value"
              v-model="seType"
              :options="seTypes"
              :invalid="$v.seType.$error"
              @blur="$v.seType.$touch()"
              @change="selectedType"
          />
          <div class="validator red-text" v-if="$v.seType.$error">
            <p v-if="!$v.seType.required">SE Type field is required.</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s11">
        <span
            id="description"
            class="materialize-textarea"
            v-html="typeDescription">
        </span>
        </div>
      </div>
      <div class="row" v-if="texts && ociDependant.includes(seType.key)">
        <div class="col s11">
          <Autocomplete
              label="Procedure/Letters"
              icon="library_books"
              :items="texts"
              v-model="se.contents"
              :invalid="$v.se.contents.$error"
              @blur="checkSeText(se.contents)"
              @input="selectedContents"
          />
          <div class="validator">
            <div class="red-text" v-if="$v.se.contents.$invalid">
              <p>SE texts field is required for selected operation.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="$v.deliveryChain.required">
        <div class="col s5 exportCheckbox">
          <label>
            <input
              ref="exportable"
              type="checkbox"
              @change="checkboxEvent(se.doExport)"
              v-model="se.doExport"
              :disabled="!exportable.includes(seType.key)"
            />
            <span>Do export on DEV instance</span>
          </label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s5">
          <button
            class="btn waves-effect waves-light right"
            type="button"
            name="action"
            :disabled="$v.$invalid || exporting.status === 'running'"
            @click="onSubmit">{{ actionName }}
          </button>
        </div>
      </div>
    </div>
    <div class="col s6" v-if="exporting.started && se.doExport">
      <div class="row">
        <div class="col s11">
          <div v-if="exporting.status === 'success'" class="center">
            <i class="material-icons large green-text">check_circle_outline</i>
            <p>Export completed successfully</p>
          </div>
          <div v-else-if="exporting.status === 'failed'" class="center">
            <i class="material-icons large red-text center">error_outline</i>
            <p>{{ exporting.comments }}</p>
            <p>{{ exporting.error }}</p>
          </div>
          <div v-else class="row">
            <p>{{ exporting.comments }}</p>
            <div class="progress" v-if="exporting.status === 'running'">
              <div class="indeterminate"></div>
            </div>
            <div class="log" ref="log" v-html="exporting.log"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { required, requiredIf } from 'vuelidate/lib/validators';
import CustomConfirm from '@/components/partials/CustomConfirm';
// import Issue from '@/components/partials/Issue';
import config from '@/config';
import WebSocket from '@/plugins/ws';

export default {
  components: {
    'custom-confirm': CustomConfirm,
    // Issue,
  },
  mounted() {
    this.getIssue();
    this.getInstanceStatus();
    this.getESType();
  },
  data() {
    return {
      error: '',
      actionName: 'Submit',
      ttsKey: this.$route.params.issue,
      deliveryChains: [],
      deliveryChain: {},
      issueStatus: '',
      instanceStatuses: [],
      ociDependant: ['bkg_trans_proc', 'bkg_trans_texte'],
      exportable: [
        'se_vdnam',
        'se_txt_lib',
        'bkg_trans_proc',
        'bkg_trans_texte',
      ],
      texts: '',
      se: {
        type_id: 'se',
        subtype_id: '',
        name: '',
        issue_id: '',
        instance: '',
        active: 1,
        visible: 1,
        delivery_chain: '',
        instance_status: '',
        doExport: '',
        contents: '',
      },
      seType: {},
      seTypes: [],
      typeDescription: '',
      defaultValue: {},
      instanceStatus: {
        selected: {},
      },
      confirmMsg: [],
      config: {},
      exporting: {
        started: false,
        status: '',
        comments: '',
        progress: null,
        log: '',
        error: null,
        queue: null,
      },
    };
  },
  validations: {
    deliveryChain: {
      required,
    },
    seType: {
      required,
    },
    instanceStatus: {
      required,
    },
    se: {
      instance: {
        required,
      },
      contents: {
        required: requiredIf((formModel) => ['bkg_trans_proc', 'bkg_trans_texte']
            .includes(formModel.key)),
      },
    },
    ttsKey: {
      required,
      validKey(value) {
        return /^[A-Z]+-[0-9]+$/.test(value);
      },
    },
  },
  watch: {
    ttsKey(key) {
      this.issueStatus = '';
      this.deliveryChains = [];
      this.$router.history.replace({ params: { issue: key } });
    },
  },
  computed: {
    issue() {
      return '';
    },
    selectedInstanceStatus(){
      return this.se.instance_status = this.defaultValue.id;
    },
  },
  methods: {
    async selectedContents(value) {
      this.se.contents = value.name;
    },
    changeIssue() {
      this.issueStatus = '';
      this.deliveryChains = [];
      this.deliveryChain = {};
      this.se.delivery_chain = '';
    },
    async getIssue() {
      this.changeIssue();
      if (this.$route.params.issue) {
        const loader = this.$loading.show({ container: this.$el });
        await this.$store.dispatch('cms/getIssue', this.$route.params.issue)
          .then(() => {
            this.se.issue_id = this.$store.state.cms.issue.id;
            if (this.$store.state.cms.issue) {
              this.deliveryChains = this.$store.state.cms.issue.project.delivery_chains;
            }
            if (!this.$store.state.cms.issue
                || (this.ttsKey !== this.$store.state.cms.issue.tts_id)) {
              this.issueStatus = 'ERROR';
            }
            loader.hide();
          });
      }
    },
    getInstanceStatus() {
      this.$store.dispatch('mmpi/getInstanceStatus').then(() => {
        this.instanceStatuses = this.$store.state.mmpi.instanceStatus;
        this.defaultValue = this.instanceStatuses.find( ({ value }) => value === 'Installer decision' );
      });
    },
    getESType() {
      this.$M.Tooltip.init(this.$refs.tooltip);
      this.$store.dispatch('mmpi/getOperationTypes').then(() => {
        this.seTypes = this.$store.getters['mmpi/getSeOperations'];
      });
    },
    selectedDeliveryChain(value) {
      this.se.delivery_chain = value;
      const [instance] = this.$store.getters['mmpi/chainDevInstance'](value.instances);
      this.se.instance = instance;
    },
    selectedType(value) {
      this.se.subtype_id = value.id;
      this.seType = value;
      this.typeDescription = value.description;
      if (!this.exportable.includes(value.key)) {
        this.se.doExport = false;
        this.actionName = 'Submit';
      }
      if (this.ociDependant.includes(value.key)) {
        this.$v.se.contents.$touch();
        this.getOciData(value);
      }
    },
    async getOciData(operation) {
      this.texts = '';
      this.se.contents = '';
      const loader = this.$loading.show({ container: this.$el });
      const data = {
        instance: this.se.instance,
        operation,
      };
      await this.$store.dispatch('mmpi/ociByOperation', data)
          .then((response) => {
            [this.texts] = Object.values(response.data);
            this.texts = this.texts.reduce((acc, text) => {
              acc.push({
                name: text,
                value: text,
              });
              return acc;
            }, []);
            loader.hide();
          })
          .catch((error) => {
            loader.hide();
            this.error = error;
            return error;
          });
    },
    checkSeText(value) {
      if (!this.texts.includes(value)) {
        this.se.contents = '';
      }
    },
    // selectedInstanceStatus(value) {
    //   this.se.instance_status = value.id;
    //   this.instanceStatus.selected = value;
    // },
    checkboxEvent(event) {
      if (event) {
        this.actionName = 'Export';
      } else {
        this.actionName = 'Submit';
      }
    },
    async onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const loader = this.$loading.show({ container: this.$el });

      const ws = new WebSocket(config.ws.url, config.ws.username_es, config.ws.password_es,
          config.ws.vhost_es);

      this.exporting.status = 'running';
      if (this.se.doExport) {
        this.exporting.started = true;
        this.exporting.comments = 'Export will start shortly ...';
      }
      await this.$store.dispatch('mmpi/exportSeModification', this.se)
        .then((response) => {
          this.confirmMsg = ['Modification has been successfully created!', 'Do you want to proceed to MMPI?'];
          if (response.data.id) {
            this.$refs['custom-confirm'].openModal();
          }

          if (!ws.client.connected) {
            return;
          }

          const subscribe = ws.client.subscribe(
            `/queue/${response.data.broadcast.queue}`,
            (message) => {
              const data = JSON.parse(message.body);
              this.exporting.status = data.status;
              if (data.comments) {
                this.exporting.comments = data.comments;
              }

              if (data.log) {
                this.exporting.log += data.log;
                this.scrollLogContainer();
              }

              if (data.status === 'failed') {
                this.exporting.status = data.status;
                this.exporting.error = data.error;
                if (data.log.includes('THERE IS NOT ENOUGH SPACE')) {
                  this.exporting.error = 'There is not enough space for the export!';
                }
                subscribe.unsubscribe();
              }

              if (this.exporting.status === 'success') {
                this.$refs['custom-confirm'].openModal();
              }
            },
            response.data.broadcast,
          );
        })
        .catch((error) => {
          this.exporting.status = 'failed';
          this.exporting.summary = 'Could not start export';
          this.exporting.error = error;
        });
      this.exporting.log = '';
      loader.hide();
    },
    scrollLogContainer() {
      setTimeout(() => {
        const container = this.$refs.log;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    },
    customConfirm(value) {
      if (value) {
        window.location.href = `${config.mmpi.web}/issue/${this.$route.params.issue}`;
      } else {
        this.confirmMsg = [];
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.card-inner {
  width: 45%;
  margin: 2rem 0rem 2rem 2rem;
}
.silver-text {
  padding-left: 3rem;
}
.log {
  height: 60vh;
  overflow: auto;
  white-space: pre;
}
.exportCheckbox {
  margin-top: 1.5rem !important;
}
</style>

