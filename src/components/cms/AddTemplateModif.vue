<template>
  <Modal
    @close="closeModal()"
    class="right-sheet">
    <template v-slot:header>
      <div>
        Add template as modification
      </div>
    </template>
    <template v-slot:content>
      <div class="row">
        <div class="input-field col s5">
          <i class="material-icons prefix">label_outline</i>
          <input id="source_path"
                type="text"
                v-model="template.source_path">
          <label
            for="source_path"
            :class="{active: template.source_path}">
            Template path
          </label>
          <div class="validator red-text" v-if="$v.template.source_path.$error">
            <span v-if="!$v.template.source_path.required">Field is required!</span>
          </div>
        </div>
        <div class="input-field col s5">
          <i class="material-icons prefix">label_outline</i>
          <label
            for="source_name"
            :class="{active: template.source_name}">
            Template name
          </label>
          <input id="source_name"
                type="text"
                v-model="template.source_name">
          <div class="validator red-text" v-if="$v.template.source_name.$error">
            <span v-if="!$v.template.source_name.required">Field is required!</span>
          </div>
        </div>
        <div class="input-field col s2">
          <a class="btn-floating btn-small waves-effect waves-light tooltipped"
            data-position="right"
            data-tooltip="Check Artifact"
            ref="tooltip"
            @click="checkTemplate()"><i class="material-icons">cached</i></a>
        </div>
        <div class="validator col s10">
          <div class="red-text"
                v-if="templateStatus === 'ERROR'">
            <span>Template not registered in MMPI</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <Select
            label="Revisions"
            icon="filter_1"
            displayed="revision"
            :options="revisions"
            @change="selectedRevision"
          />
          <div class="validator red-text" v-if="$v.revisions.$error">
            <span v-if="!$v.revisions.required">Field is required!</span>
          </div>
        </div>
      </div>
      <div v-if="templates.length">
        <table class="highlight">
          <thead>
            <tr>
              <th class="icon"></th>
              <th v-for="(value, key) in templateCol"
                v-bind:key="key">
                {{value | capitalize}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(option, key) in templates"
                v-bind:key="key"
                @click="selectedTemplate(option)"
                class="content"
                @mouseover="active = key"
                @mouseleave="active = null">
                <td class="icon">
                  <i v-if="active === key" class="material-icons">fiber_manual_record</i>
                  <i v-else class="material-icons">radio_button_unchecked</i>
                </td>
                <td v-for="(value, key) in templateCol"
                    v-bind:key="key">{{option[value]}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn waves-effect waves-light"
        type="button"
        name="action"
        @click="addTemplate()">
        Save
      </button>
    </template>
  </Modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      loader: '',
      templateStatus: '',
      template: {
        source_path: '',
        source_name: '',
      },
      revisions: [],
      templateCol: ['source_name', 'source_path'],
    };
  },
  watch: {
    data(data) {
      this.template = data.selectedTemplate;
      this.checkTemplate();
    },
  },
  filters: {
    capitalize(str) {
      const head = str.split('_').join(' ');
      return head.charAt(0).toUpperCase() + head.slice(1);
    },
  },
  validations: {
    template: {
      source_name: {
        required,
      },
      source_path: {
        required,
      },
    },
    revisions: {
      required,
    },
  },
  computed: {
    templates() {
      return this.$store.getters['cms/getTemplates'];
    },
  },
  methods: {
    async selectedTemplate(value) {
      if (value) {
        // changing input values won't affect store
        this.template = value;
        await this.$store.dispatch('cms/getRevisions', value);
        this.revisions = this.$store.state.cms.revisions;
        this.showModal = false;
      }
    },
    checkTemplate() {
      // don't check if the fields are empty
      if (this.template.source_name || this.template.source_path) {
        this.loader = this.$loading.show({ container: this.$el });
        // get only templates ending on _tpl or _bin
        const payload = {
          with: ['revisions'],
          filters: JSON.stringify({
            allOf: [
              {
                allOf: [
                  {
                    source_name: {
                      value: `%${this.template.source_name}%`,
                      operator: 'like',
                    },
                  },
                  {
                    anyOf: [
                      {
                        source_name: {
                          value: '%_bin',
                          operator: 'like',
                        },
                      },
                      {
                        source_name: {
                          value: '%_tpl',
                          operator: 'like',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                source_path: {
                  value: `%${this.template.source_path}%`,
                  operator: 'like',
                },
              },
            ],
          }),
        };

        this.$store.dispatch('cms/getTemplatesMMPI', payload).then(() => {
          this.templateStatus = '';
          if (!this.$store.state.cms.templates.length === 0) {
            this.templateStatus = 'ERROR';
          }
          this.template.source_name = '';
          this.template.source_path = '';
          this.loader.hide();
        });
      } else {
        this.$v.template.$touch();
      }
    },
    async selectedTemplate(value) {
      if (value) {
        // changing input values won't affect store
        this.template = value;
        await this.$store.dispatch('cms/getRevisions', value);
        this.revisions = this.$store.state.cms.revisions;
      }
    },
    selectedRevision(value) {
      this.revisions.selected = value;
      // if there is no add button, emit value immediately after revision is selected
      if (!this.data || !this.data.add) {
        this.$emit('return', { template: this.template, revision: value });
      }
    },
    addTemplate() {
      if (this.template.path_and_name && this.revisions.selected.revision) {
        this.$emit('return', { template: this.template, revision: this.revisions.selected });

        this.template = {
          source_path: '',
          source_name: '',
        };

        this.revisions.selected = {};
        this.revisions.options = [];
      } else {
        this.$v.template.$touch();
        this.$v.revisions.$touch();
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>