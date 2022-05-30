<template>
  <div class="row">
    <div class="col s12">

      <div class="row">
        <div class="col s12">
          <h4 class="center-align">iMX Components</h4>
        </div>
      </div>

      <div class="row">
        <div id="tabs" class="col s12">
          <ul class="tabs row">
            <li class="tab col s6">
              <a href="#comp_info">Components info</a>
            </li>
            <li class="tab col s6">
              <a href="#exp_comps">Expiring components</a>
            </li>
          </ul>
          <div id="comp_info" class="comp-divs">
            <ImxComponentsInfo/>
          </div>
          <div id="exp_comps" class="comp-divs">
            <ExpiringImxComponents/>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
const ImxComponentsInfo = () => import('./ImxComponentsInfo');
const ExpiringImxComponents = () => import('./ExpiringImxComponents');

export default {
  components: {
    ImxComponentsInfo,
    ExpiringImxComponents,
  },

  mounted() {
    const elems = document.querySelectorAll('.tabs');
    this.$M.Tabs.init(elems);
  },
};
</script>

<style lang="scss" scoped>
  .comp-divs {
    margin: 40px;
  }
</style>
