<template>
  <div>
    <div class="col s12 l12">
      <h1 class="center">Templates</h1>
      <custom-confirm ref="custom-confirm"
                      :message="confirmMsg"
                      @selectedVal="customConfirm"/>
      <search-tmp class="frame" @return="getContent"/>
    </div>
    <commit-msg v-if="showMsg"
                @selectedVal="setCommitMsg"/>
    <div class="card" v-show="content">
      <div class="card-content">
        <div class="container">
          <h6 class="center-align">{{contentTitle}}</h6>
          <div class="frame">
            <div class="row">
              <div class="input-field col s12">
                <i class="material-icons prefix">label_outline</i>
                <textarea ref="tmp_content"
                          id="tmp_content"
                          class="materialize-textarea"
                          :disabled="disable"
                          v-model.trim="content"></textarea>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12 center-align">
                <a href="#!"
                  @click="showMsg = `true`"
                  class="btn waves-effect waves-light"
                  style="data-original-height: 0"
                  :disabled="disable">Update</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.overflow {
  overflow-x: scroll;
}
</style>
<script>
import CommitMsg from '@/components/cms/CommitMsg';
import SearchTemplate from '@/components/cms/SearchTemplate';
import CustomConfirm from '@/components/partials/CustomConfirm';

export default {
  components: {
    'commit-msg': CommitMsg,
    'custom-confirm': CustomConfirm,
    'search-tmp': SearchTemplate,
  },
  data() {
    return {
      loader: '',
      isLastRev: false,
      commitMsg: '',
      showMsg: false,
      confirmMsg: [],
      template: {},
      revision: {},
    };
  },
  computed: {
    disable() {
      // only in mmpi prod db is inserted the real last revision of the source
      return !this.isLastRev
             || (this.$store.getters.user.username !== 'iignatova'
                && this.$store.getters.user.username !== 'eseimenova')
             || process.env.NODE_ENV !== 'production';
    },
    contentTitle() {
      return `${this.template.path_and_name} - ${this.revision.revision}`;
    },
    content() {
      return this.$store.state.cms.templateContent;
    },
  },
  methods: {
    resize() {
      this.$M.textareaAutoResize(this.$refs.tmp_content);
    },
    getContent(value) {
      if (value) {
        this.isLastRev = false;
        this.loader = this.$loading.show({ container: this.$el });
        const { revisions } = this.$store.state.cms;
        if (value === revisions[revisions.length - 1]) {
          this.isLastRev = true;
        }

        this.template = value.template;
        this.revision = value.revision;

        const payload = {
          source_path: this.template.source_path,
          source_name: this.template.source_name,
          revision: this.revision.revision,
        };

        this.$store.dispatch('cms/getTemplateContent', payload).then(() => {
          // without this line it won't AutoResize!
          this.loader.hide();
          this.resize();
        });
      }
    },
    updateContent() {
      this.loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('cms/submitTemplate', { content: this.content, commitMsg: this.commitMsg })
        .then(() => {
          this.loader.hide();
          this.confirmMsg = ['Template has been successfuly updated!'];
          this.$refs['custom-confirm'].openModal();
        });
    },
    setCommitMsg(value) {
      this.commitMsg = value;
      this.updateContent();
    },
    customConfirm() {
      this.content = '';
      this.$store.state.cms.templates = {};
      this.$store.state.cms.revisions = [];
    },
  },
};
</script>
