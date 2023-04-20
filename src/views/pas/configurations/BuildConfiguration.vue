<template>
  <Modal class="right-sheet" @close="$emit('close')">
    <template v-slot:header>
      <span v-if="action === 'build'">Build configuration</span>
    </template>
    <template v-slot:content>
      <form v-if="!build.started">
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">label_outline</i>
            <label class="active" for="tts_key">TTS Key</label>
              <input
                 id="tts_key"
                 type="text"
                 v-model.trim="ttsKey"
                 :invalid="$v.ttsKey.$error"
                 @blur="$v.ttsKey.$touch()"
              />
            <div class="validator col s12"
                v-if="$v.ttsKey.$error || issueError">
              <div class="red-text" v-if="!$v.ttsKey.required">
                <p>Field is required</p>
              </div>
              <div class="red-text" v-if="!$v.ttsKey.validKey">
                <p>Not a valid TTS key.</p>
              </div>
              <div class="red-text" v-if="issueError">
                <p>{{ issueError }}</p>
              </div>
            </div>
          </div>
        </div>

        <div
            v-if="configuration.app_type === 'extranet' && configuration.app_version === 'X4'"
            class="row">
          <div class="col s12">
            <Autocomplete
                label="X4Config"
                icon="dynamic_feed"
                :items="x4configs"
                valueKey="name"
                v-model="x4config"
                :invalid="$v.x4config.$error"
                @blur="$v.x4config.$touch()"
            />
          </div>
          <div class="validator col s11 offset-s1">
            <div class="red-text" v-if="$v.x4config.$error">
              <p v-if="!$v.x4config.required">
                Config field must not be empty.
              </p>
            </div>
          </div>
        </div>
        <div
            v-if="configuration.app_type === 'extranet' && configuration.app_version === 'X4'"
            class="row">
          <div class="col s12">
            <Autocomplete
                label="Project"
                icon="dynamic_feed"
                :items="projects"
                valueKey="name"
                v-model="project"
            />
          </div>
          <div class="validator col s11 offset-s1">
            <div class="red-text" v-if="$v.project.$error">
              <p v-if="!$v.project.required">
                Project field must not be empty.
              </p>
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
          <TextInput
              class="col s12"
              v-if="binaryType.value === 'Manual'"
              v-model="configName"
              icon="more_vert"
              label="Config Name"
          />
          <div class="validator col s12">
            <div class="red-text" v-if="$v.configName.$error">
              <p>Config name field must not be empty.</p>
            </div>
          </div>
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
          <h6 class="center">CHOOSE HASH/BRANCH
            <span v-if="repository">
              from repository <a :href="repositoryUrl">{{repository}}</a>
            </span>
            <span v-if="feRepository">
              and FE repository <a :href="feRepositoryUrl">{{feRepository}}</a>
            </span>
          </h6>
          <div class="row">
            <Autocomplete
              class="col s12"
              label="Hash"
              icon="devices"
              valueKey="summary"
              :items="hashes"
              v-model="hash"
              :invalid="$v.hash.$error"
              @blur="$v.hash.$touch()"
            />
            <div class="validator col s12">
              <div class="red-text" v-if="$v.hash.$error">
                <p v-if="!$v.hash.required"> BE hash field must not be empty.</p>
              </div>
            </div>
            <div v-if="hash" class="col s12">
              <pre>{{ hash.description }}</pre>
            </div>
          </div>
          <div class="row" v-if="feHashes.length">
            <Autocomplete
              class="col s12"
              label="Fe Hash"
              icon="devices"
              valueKey="summary"
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
            <div v-if="feHash" class="col s12">
              <pre>{{ feHash.description }}</pre>
            </div>
          </div>
        </div>
      </form>
      <BuildProgress
        v-else
        :stages="['build', 'repack', 'deploy', 'verify']"
        :broadcast="build.broadcast"
        :status="build.status"
        :summary="build.summary"
        :error="build.error"
      />
    </template>
    <template v-slot:footer>
      <button v-if="!build.started" class="waves-effect btn" @click="start()">
        <i class="material-icons left">play_arrow</i> Start
      </button>
    </template>
  </Modal>
</template>

<script>

import { required, requiredIf } from 'vuelidate/lib/validators';
import _ from 'lodash';
import TextArea from '@/components/TextArea';
import BuildProgress from '@/components/BuildProgress';
import EventBus from '@/event-bus';

export default {
  components: {
    TextArea,
    BuildProgress,
  },

  props: {
    configuration: Object,
    action: String,
  },

  data() {
    return {
      ttsKey: this.$route.params.issue,
      issueError: null,
      binaryType: {},
      configName: '',
      comments: '',
      hash: null,
      feHash: null,
      repository: null,
      repositoryUrl: null,
      feRepository: null,
      feRepositoryUrl: null,
      x4config: null,
      project: null,
      build: {
        started: false,
        status: '',
        summary: '',
        error: null,
        broadcast: null,
      },
    };
  },

  watch: {
    ttsKey() {
      if (this.$v.ttsKey.$invalid) {
        return;
      }
      this.debounceCheckIssue();
    },
    hashes() {
      if (this.hashes && this.hashes.length > 0) {
        if (this.hashes[0].repository) {
          this.repository = this.hashes[0].repository;
        }

        if (this.hashes[0].repositoryUrl) {
          this.repositoryUrl = this.hashes[0].repositoryUrl;
        }
      }
    },
    feHashes() {
      if (this.feHashes && this.feHashes.length > 0) {
        if (this.feHashes[0].repository) {
          this.feRepository = this.feHashes[0].repository;
        }

        if (this.feHashes[0].repositoryUrl) {
          this.feRepositoryUrl = this.feHashes[0].repositoryUrl;
        }
      }
    },
    project() {
      if (this.project && this.project.name === 'xnet') {
        const found = this.binaryTypes.filter((obj) => Object.keys(obj).some(() => obj.subtype === 'xnet'));
        const xnetBinaryType = found[0];
        this.binaryType = xnetBinaryType;
      }

      if (this.project && this.project.name === 'xnet-admin') {
        const found = this.binaryTypes.filter((obj) => Object.keys(obj).some(() => obj.subtype === 'xnet-admin'));
        const adminBinaryType = found[0];
        this.binaryType = adminBinaryType;
      }
    },
  },

  computed: {
    x4configs() {
      return this.$store.getters['pas/getX4ParamsByType']('config');
    },

    projects() {
      return this.$store.getters['pas/getX4ParamsByType']('project');
    },

    binaryTypes() {
      return this.$store.state.mmpi.binaryTypes;
    },

    hashes() {
      return this.configuration.app_version === 'X4' && this.configuration.app_type === 'extranet'
        ? this.$store.state['extranet-x4'].branches.map((hash) => {
          hash.summary = hash.name;
          return hash;
        })
        : this.$store.state.pas.hashes.map((hash) => {
          hash.summary = `${hash.commit} by ${hash.user} on ${this.$date(hash.date).toHuman()}`;
          return hash;
        });
    },

    feHashes() {
      return this.configuration.app_version === 'X4' && this.configuration.app_type === 'extranet'
        ? []
        : this.$store.state.pas.feHashes.map((hash) => {
          hash.summary = `${hash.commit} by ${hash.user} on ${this.$date(hash.date).toHuman()}`;
          return hash;
        });
    },

    client() {
      if (this.configuration.app_type === 'extranet') {
        return this.$store.state.extranet.clients
          .find((client) => client.package === this.configuration.prefix);
      }

      if (this.configuration.app_type === 'debiteur') {
        return this.store.state.debiteur.clients
          .find((client) => client.package === this.configuration.prefix);
      }

      return null;
    },

    instance() {
      if (this.configuration.dev_instance) {
        return this.$store.state.mmpi.instances
          .find((instance) => instance.name === this.configuration.dev_instance);
      }
      return null;
    },

    deployInstance() {
      if (this.configuration.deploy_dev_instance) {
        return this.$store.state.mmpi.deploy_instances
          .find((instance) => instance.name === this.configuration.deploy_dev_instance);
      }

      return null;
    },
  },

  validations() {
    const rules = {
      ttsKey: {
        required,
        validKey(value) {
          return /^[A-Z0-9]+-[0-9]+$/.test(value);
        },
      },
      configName: {
        required: requiredIf((formModel) => formModel.binaryType.subtype === 'manual'),
      },
      hash: {
        required,
        commit: {
          required,
        },
      },
    };

    if (this.feHashes.length) {
      rules.feHash = {
        required,
        commit: {
          required,
        },
      };
    }

    if (this.configuration.app_type === 'extranet' && this.configuration.app_version === 'X4') {
      rules.x4config = {
        required,
        name: {
          required,
        },
      };

      rules.project = {
        required,
        name: {
          required,
        },
      };
    }

    return rules;
  },

  methods: {
    async checkIssue() {
      this.issueError = null;
      await this.$store.dispatch('mmpi/getIssue', this.ttsKey)
        .then(() => {
          this.issueError = false;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.issueError = 'Issue with this key does not exists';
          }
          this.issueError = 'Could not validate issue key';
        });
    },

    debounceCheckIssue: _.debounce(() => {
      this.checkIssue();
    }, 2000),

    async start() {
      const loader = this.$loading.show({ });
      await this.checkIssue();

      this.$v.$touch();
      if (this.$v.$invalid || this.issueError) {
        loader.hide();
        return;
      }

      const payload = {
        branch: this.configuration.app_type === 'extranet' && this.configuration.app_version === 'X4' ? this.hash.name : this.hash.commit,
        fe_branch: this.feHash ? this.feHash.commit : null,
        instance: this.instance,
        deploy_instance: this.deployInstance,
        delivery_chain: this.configuration.delivery_chain,
        client: this.client,
        x4config: this.x4config ? this.x4config.name : null,
        project: this.project ? this.project.name : null,
        mmpi: {
          binary_type: this.binaryType,
          config_name: this.configName,
          comments: this.comments,
          ttsKey: this.ttsKey,
        },
      };

      this.$store.dispatch('pas/buildConfiguration', {
        id: this.configuration.id,
        payload,
      })
        .then((response) => {
          this.build.status = 'running';
          this.build.summary = 'Build will start shortly ...';
          this.build.broadcast = response.data.broadcast;
          EventBus.$emit('build.created');
        })
        .catch((error) => {
          loader.hide();
          this.build.status = 'failed';
          this.build.summary = 'Could not start build';
          if (error.response.status === 403) {
            this.build.error = 'You do not have insufficient rights to create build';
          } else {
            this.build.error = error;
          }
        })
        .finally(() => {
          this.build.started = true;
          loader.hide();
        });
    },
  },

  created() {
    this.$store.dispatch('mmpi/getBinaryTypes').then(() => {
      this.binaryType = this.binaryTypes
        .find((binaryType) => binaryType.subtype === this.configuration.app_type);
    });

    this.$store.dispatch('mmpi/getDeployInstances');
    this.$store.dispatch('mmpi/getInstances');
    this.$store.dispatch('pas/getHashes', this.configuration.branch);
    this.$store.dispatch('pas/getFeHashes', this.configuration.branch);
    this.$store.dispatch('extranet/getClients');
    this.$store.dispatch('debiteur/getClients');
    this.$store.dispatch('extranet-x4/getBranches');
    this.$store.dispatch('pas/getX4Params');
  },
};
</script>
