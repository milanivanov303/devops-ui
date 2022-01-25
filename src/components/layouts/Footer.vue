<template>
  <footer>
    <div class="footer-copyright">
      <div class="row">
        <div class="col s4">
          <a :href="getApiDocumentationLink()" target="_blank">
            <i class="material-icons">library_books</i>
            API documentation
          </a>
        </div>
        <div class="col s4 center-align"></div>
        <div class="col s4 right-align">
          <p>Copyright © 2019 Codix | Devops Management v1.0</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import config from '../../config';

export default {
  data() {
    return {};
  },
  methods: {
    getApiDocumentationLink() {
      return `${config.devops.url}/../docs.html`;
    },
  },
};
</script>

<style lang="scss" scoped>
  a {
    height: 48px;
    line-height: 48px;
    i {
      float: left;
      height: 48px;
      line-height: 48px;
      margin-right: 10px;
    }
  }
</style>
