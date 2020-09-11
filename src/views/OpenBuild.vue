<template>
<main>
  <div class="container">
    <h6 class="row center">Opening build <b>{{ $route.params.name }}</b></h6>
    <div class="row center">
      <i v-if="buildStatus === 'not-found'" class="material-icons large">cancel</i>
      <i v-if="buildStatus === 'build-starting' || buildStatus === 'build-started'" class="material-icons large">laptop_chromebook</i>
      <i v-if="buildStatus === 'tomcat-started'" class="material-icons large">check_circle</i>
    </div>
    <div class="row center">.
      <div v-if="buildStatus === 'not-found'" class="row">
        <h2 class="row center">- Sorry -</h2> 
        <h5 class="row center">There is no such build</h5> 
      </div>

      <div class="row center">
        <div class="row">
          <div id="buildProgress" class="progress col s12 m10 offset-m1 hidden">
            <div class="indeterminate"></div>
          </div>
        </div>
        <h5 v-if="buildStatus === 'build-starting'" class="row center">Build starting...</h5>
        <h5 v-if="buildStatus === 'build-started'" class="center">Build started successfully!<br>Waiting for tomcat to start...</h5>
        <h5 v-if="buildStatus === 'tomcat-started'" class="row center">Build is working!</h5>
        <div class="row">
          <div id="tomcatProgress" class="progress col s8 offset-s2 m4 offset-m4 hidden">
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
      buildStatus: '',
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

          this.buildStatus = 'tomcat-started'
          document.getElementById('tomcatProgress').classList.add('hidden');
 
          setTimeout(() => window.location.reload(), 1000);
        })
        .catch(() => {
          //no longer than 5 min

          setTimeout(() => this.checkBuild(), 3000);
        });
    },

  },

  mounted() {
    api.get('builds', { name: this.name })
      .then((response) => {
        if (response.data.data.length === 0) {
          this.buildStatus = 'not-found';
          return;
        }

        this.build = response.data.data[0];

        if (this.build.status === 'stopped') {

          this.buildStatus = 'build-starting';
          document.getElementById('buildProgress').classList.remove('hidden');
         
          api.post(`builds/${this.build.id}/start`)
            .then(() => {

              this.buildStatus = 'build-started';
              document.getElementById('buildProgress').classList.add('hidden');

              // We wait for tomcat to start now
              document.getElementById('tomcatProgress').classList.remove('hidden');

              this.checkBuild();
            });
          return;
        }

        this.checkBuild();
      });
  },
};
</script>

<style scoped lang='scss'>
  .page main{
    padding-left: 0 !important;
    padding-top: 200px;
  }

  i.large {
    font-size: 17rem;
  }

  #buildProgress {
    background-color: #ededed;
    border-radius: 13px;
    padding: 3px;
    height: 15px !important;
  }

  #buildProgress>div {
    background-color: #222831;
    border-radius: 10px;
    margin: 3px 0 3px 0;
  }
  #tomcatProgress {
    background-color: #ededed;
    border-radius: 13px;
    padding: 3px;
    height: 5px !important;
  }

  #tomcatProgress>div {
    background-color: #222831;
    border-radius: 10px;
    margin: 3px 0 3px 0;
  }

  .hidden {
    display: none;
  }

</style>
