<template>
  <div class="loading">
    <Preloader/>
  </div>
</template>

<style lang="scss" scoped>
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -60px;
    margin-left: -60px;

    .preloader-wrapper {
      width: 120px;
      height: 120px;
    }
  }
</style>
