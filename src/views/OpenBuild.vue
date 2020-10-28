<template>
<main>
  <div class="container">
    <h6 class="row center">Opening build <b>{{ $route.params.name }}</b></h6>
    <div ref="autostart_builds">
      <div v-bind:class="{ fail: build.status === 'removed'}" id="autostart_builds"
           class="row center">
        <i class="material-icons">{{ icon }}</i>
      </div>
      <div class="row center">
        <div class="row">
          <div id="buildProgress" class="progress col s12 m10 offset-m1 hidden">
            <div class="indeterminate"></div>
          </div>
        </div>
        <h3 class="center">{{ header }}</h3>
        <h5 class="center">{{ message }}</h5>
        <div class="row">
          <div v-bind:class="{ hidden: build.status === 'removed' }" id="tomcatProgress"
               class="progress col s8 offset-s2 m4 offset-m4 hidden">
            <div class="indeterminate"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

</template>

<script>

const api = apiAuto('devops');

export default {
  data() {
    return {
      build: {},
      icon: '',
      header: '',
      message: '',
      checkTimer: 0,
      reload: true,
    };
  },
  computed: {
    name() {
      return this.$route.params.name;
    },
  },
  methods: {
    checkBuild() {
      api.get(`builds/${this.build.id}/ping`)
        .then(() => {
          if (!this.reload) {
            document.getElementById('tomcatProgress').classList.add('hidden');
            document.getElementById('autostart_builds').classList.add('fail');

            this.icon = 'cancel';
            this.header = '- Could not load the build -';
            this.message = 'Please try again or contact phpid';

            return;
          }

          document.getElementById('tomcatProgress').classList.add('hidden');
          document.getElementById('autostart_builds').classList.add('success');

          this.icon = 'check_circle';
          this.header = '- Build is working -';
          this.message = '';

          setTimeout(() => window.location.reload(), 2000);
        })
        .catch(() => {
          if (this.checkTimer >= 5 * 60 /* 5 minutes */) {
            document.getElementById('tomcatProgress').classList.add('hidden');
            document.getElementById('autostart_builds').classList.add('fail');

            this.icon = 'cancel';
            this.header = '- Tomcat could not start -';
            this.message = 'Please contact phpid';

            return;
          }
          this.reload = true;
          setTimeout(() => this.checkBuild(), 3000);
        });
    },
  },

  mounted() {
    const loader = this.$loading.show({ container: this.$refs.autostart_builds });

    api.get('builds', { name: this.name })
      .then((response) => {
        loader.hide();
        if (response.data.data.length === 0) {
          document.getElementById('autostart_builds').classList.add('fail');
          this.icon = 'cancel';
          this.header = '- Sorry - ';
          this.message = 'There is no such build';
          return;
        }

        [this.build] = response.data.data;

        if (this.build.status === 'removed') {
          this.reload = false;

          this.icon = 'cancel';
          this.header = '- This build has been removed -';
          this.message = `on ${this.$date(this.build.removed_on).toHuman()} by ${this.build.removed_by}`;

          return;
        }

        if (this.build.status === 'running') {
          this.reload = false;
        }

        this.icon = 'laptop_chromebook';
        this.message = 'Build starting...';
        document.getElementById('buildProgress').classList.remove('hidden');

        api.post(`builds/${this.build.id}/start`)
          .then(() => {
            this.header = '- Build started successfully - ';
            this.message = 'Waiting for tomcat to start...';

            document.getElementById('buildProgress').classList.add('hidden');
            document.getElementById('tomcatProgress').classList.remove('hidden');

            setInterval(() => { this.checkTimer += 1; }, 1000);
            this.checkBuild();
          });
      });
  },
};
</script>

<style scoped lang='scss'>
  .page main{
    padding-left: 0 !important;
    padding-top: 200px;
  }

  i {
    font-size: 17rem;
  }

  .success {
    color: #29A19C

  }

  .fail {
    color: #C40147;

  }

  </style>
