<template>
  <div @submit.prevent="onSubmit" id="action" ref="upload-rsp-file" class="modal right-sheet">
    <div class="frame">
      <div class="modal-content">
        <h3 class="center">Upload instance.rsp file</h3>
        <form>
          <div class="row">
            <SelectModel
              class="col s12"
              label="Projects"
              icon="laptop_mac"
              displayed="name"
              v-model="project"
              :options="projects"
              :invalid="$v.project.$error"
              @blur="$v.project.$touch()"
              @change="selectedProject"
            />
            <div class="validator red-text" v-if="$v.project.$error">
              <p v-if="!$v.project.required">Field is required!</p>
            </div>
          </div>
          <div class="row">
            <SelectModel
              class="col s12"
              label="Delivery chains"
              icon="linear_scale"
              displayed="title"
              v-model="deliveryChain"
              :options="chains"
              :invalid="$v.deliveryChain.$error"
              @blur="$v.deliveryChain.$touch()"
            />
            <div class="validator red-text" v-if="$v.deliveryChain.$error">
              <p v-if="!$v.deliveryChain.required">Field is required!</p>
            </div>
          </div>
          <div class="row">
            <SelectModel
              class="col s12"
              label="Instance"
              icon="storage"
              displayed="name"
              v-model="instance"
              :options="getInstances"
              :invalid="$v.instance.$error"
              @blur="$v.instance.$touch()"
            />
            <div class="validator red-text" v-if="$v.instance.$error">
              <p v-if="!$v.instance.required">Field is required!</p>
            </div>
          </div>
          <div class="row">
            <div class="file-field input-field col s12">
              <i class="material-icons prefix">file_upload</i>
              <div class="select-wrapper">
                <input type="file" id="file" ref="file" @change="handleFileUpload()">
                <div class="file-path-wrapper">
                  <input class="file-path validate" type="text">
                </div>
              </div>
            </div>
            <div class="validator col s12">
              <div class="red-text" v-if="$v.file.$invalid">
                <p>File field must not be empty.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s12 m6 l6">
              <button class="btn waves-effect waves-light right"
                      type="submit"
                      name="action"
                      :disabled="$v.$invalid">Upload</button>
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
<script>
import { required } from 'vuelidate/lib/validators';
import SelectModel from '@/components/partials/SelectModel';

export default {
  components: {
    SelectModel,
  },
  mounted() {
    this.$M.Modal.init(this.$refs['upload-rsp-file'], {
      dismissible: false,
      preventScrolling: false,
    }).open();
  },
  props: {
    projects: {
      type: Array,
      required: true,
    },
    chains: {
      type: Array,
      required: true,
    },
    selected: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      file: '',
      instance: {},
      project: this.selected.project,
      deliveryChain: this.selected.deliveryChain,
    };
  },
  validations: {
    project: {
      required,
    },
    deliveryChain: {
      required,
    },
    instance: {
      required,
    },
    file: {
      required,
    },
  },
  computed: {
    getInstances() {
      return this.deliveryChain.instances || [];
    },
  },
  methods: {
    selectedProject(value) {
      const loader = this.$loading.show({ container: this.$el });
      this.$store.dispatch('mmpi/getDeliveryChainsCMS', {
        project: value.id,
        status: 'active',
        order_by: 'title asc',
        with: JSON.stringify({
          instances: {},
        }),
      }).then(() => {
        loader.hide();
      });
    },
    cancel() {
      this.$M.Modal.init(this.$refs['upload-rsp-file']).close();
      this.$emit('return', false);
    },
    onSubmit() {
      const loader = this.$loading.show({ container: this.$refs['upload-rsp-file'] });
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('instance_id', this.instance.id);
      formData.append('instance_name', this.instance.name);

      this.$store.dispatch('cms/uploadRspFile', formData).then(() => {
        // update instances
        this.$store.dispatch('cms/getInventoryInstances', this.deliveryChain.instances).then(() => {
          loader.hide();
          this.cancel();
        });
      });
    },
    handleFileUpload() {
      [this.file] = this.$refs.file.files;
    },
  },
};
</script>
