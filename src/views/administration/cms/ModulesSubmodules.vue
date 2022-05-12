<template>
  <div>
  <div class="row">
    <h4 class="center">CMS Modules / Submodules details</h4>
  </div>
  <div class="row">
    <div class="col s12">
      <ul class="tabs row">
        <li class="tab col s6">
          <a href="#modules">MODULES DETAILS</a>
        </li>
        <li class="tab col s6">
          <a href="#submodules">SUBMODULES DETAILS</a>
        </li>
      </ul>
      <div id="modules">
        <CmsModulesDetails/>
      </div>
      <div id="submodules">
        <CmsSubmodulesDetails/>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
const CmsModulesDetails = () => import('./CmsModulesDetails');
const CmsSubmodulesDetails = () => import('./CmsSubmodulesDetails');

export default {
  components: {
    CmsModulesDetails,
    CmsSubmodulesDetails,
  },
  mounted() {
    const elems = document.querySelectorAll('.tabs');
    this.$M.Tabs.init(elems);
  },
};
</script>
