<template>
  <div>
  <div class="row">
    <h4 class="center">CMS Modules / Submodules details</h4>
  </div>
  <div class="row">
    <div class="col s12">
      <ul class="tabs row">
        <li class="tab col s6">
          <a href="#esxi_details">MODULES DETAILS</a>
        </li>
        <li class="tab col s6">
          <a href="#memory_slots">SUBMODULES DETAILS</a>
        </li>
      </ul>
      <div id="esxi_details">
        <EsxiDetails :esxiHost="esxiHost"/>
      </div>
      <div id="memory_slots">
        <MemorySlots :esxiHost="esxiHost"/>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
const CmsModulesDetails = () => import('./CmsModulesDetails');
const CmsSubmodulesDetails = () => import('./CmsSubmodulesDetails');

export default {

}
</script>
