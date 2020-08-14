<template>
  <div>
    <choices-modal v-if="showModal"
                   :data="templates"
                   @selectedVal="selectedTemplate"/>
    <form @submit.prevent="submitted">
      <div class="row">
        <div class="input-field col s4">
          <i class="material-icons prefix">label_outline</i>
          <input id="source_path"
                 type="text"
                 v-model="template.source_path">
          <label
            for="source_path"
            :class="{active: template.source_path}">
            Template path
          </label>
        </div>
        <div class="input-field col s4">
          <i class="material-icons prefix">label_outline</i>
          <label
            for="source_name"
            :class="{active: template.source_name}">
            Template name
          </label>
          <input id="source_name"
                 type="text"
                 v-model="template.source_name">
        </div>
        <div class="input-field col s1">
          <a class="btn-floating btn-small waves-effect waves-light tooltipped"
             data-position="right"
             data-tooltip="Check Artifact"
             ref="tooltip"
             @click="checkTemplate()"><i class="material-icons">cached</i></a>
        </div>
        <SelectModel
          class="col s2"
          label="Revisions"
          icon="filter_1"
          displayed="revision"
          :options="revisions"
          @change="selectedRevision"
        />
        <div v-if="data" class="input-field col s1">
          <a class="btn-floating btn-small waves-effect waves-light tooltipped"
             data-position="right"
             data-tooltip="Add"
             ref="tooltip"
             @click="addTemplate()"><i class="material-icons">add</i></a>
        </div>
        <div class="validator col s10">
          <div class="red-text"
                v-if="templateStatus === 'ERROR'">
            <span>Template not registered in MMPI</span>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<style scoped>
.overflow {
  overflow-x: scroll;
}
</style>
<script>
import ChoicesModal from '@/components/partials/ChoicesModal';
import SelectModel from '@/components/partials/SelectModel';

export default {
  components: {
    SelectModel,
    'choices-modal': ChoicesModal,
  },
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      loader: '',
      templateStatus: '',
      template: {
        source_path: '',
        source_name: '',
      },
      revisions: [],
      templates: {
        columns: ['source_name', 'source_path'],
        options: [],
      },
      showModal: false,
    };
  },
  watch: {
    data(data) {
      this.template = data.selectedTemplate;
      this.checkTemplate();
    },
  },
  methods: {
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
          if (this.$store.state.cms.templates.length > 0) {
            this.templates.options = this.$store.getters['cms/getTemplates'];
            this.showModal = true;
          } else {
            this.templateStatus = 'ERROR';
          }
          this.loader.hide();
        });
        // parent component will know that event was fired
        this.$emit('return', null);
      }
    },
    async selectedTemplate(value) {
      if (value) {
        // changing input values won't affect store
        this.template = value;
        await this.$store.dispatch('cms/getRevisions', value);
        this.revisions = this.$store.state.cms.revisions;
        this.showModal = false;
      }
    },
    selectedRevision(value) {
      this.revisions.selected = value;
      // if there is no add button, emit value immediately after revision is selected
      if (!this.data || !this.data.add) {
        this.$emit('return', { template: this.template, revision: value });
        this.showModal = false;
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
        this.showModal = false;
      }
    },
  },
};
</script>
