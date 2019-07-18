<template>
  <div class="alert error scale-transition">
    <span class="white-text">
      {{ msg }}
    </span>
    <a href="#" class="alert-close right">
      <i class="material-icons">close</i>
    </a>
  </div>
</template>

<script>
export default {
  props: ['msg'],
  mounted() {
    document.getElementsByClassName('alert-close')[0].addEventListener('click', ({ target }) => {
      target.closest('.alert').classList.add('hide');
    });
  },
};
</script>
