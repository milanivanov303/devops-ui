<template>
  <div class="row">
    <div class="col s6">
      <Select
        :options="images"
        icon="cloud_upload"
        label="Deploy on"
        displayed="label"
        :default-option="false"
        v-model="image"
      />
    </div>
    <div class="col s6" v-if="build.status === 'running' || build.status === 'stopped'">
      <button class="btn btn-small" @click="change" :disabled="changing">
        <span v-if="changing">Changing ...</span>
        <span v-else>Change</span>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    build: {
      type: Object,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      image: this.build.details.image,
      changing: false,
    };
  },

  computed: {
    images() {
      return this.$store.state[this.module].images;
    },
  },

  methods: {
    async change() {
      this.changing = true;

      await this.$store.dispatch('builds/changeImage', {
        id: this.build.id,
        image: this.image,
      });

      if (this.build.status === 'running') {
        await this.$store.dispatch('builds/stop', this.build.id);
        await this.$store.dispatch('builds/start', this.build.id);
      }

      this.changing = false;
    },
  },

  created() {
    this.$store.dispatch(`${this.module}/getImages`);
  },
};
</script>
