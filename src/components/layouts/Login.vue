<script>
export default {
  methods: {
    async login() {
      // If there is token in url set it in auth storage
      if (this.$route.query.token) {
        auth.storage.set('token', this.$route.query.token);
      }

      await auth.getIdentity()
        .then((response) => {
          // If there is token in response set it in auth storage
          if (response.data.token) {
            auth.storage.set('token', response.data.token);
          }

          auth.setUser({
            username: response.data.username,
            name: response.data.name,
            country: response.data.country,
            permissions: response.data.permissions,
          });
          auth.setLastActiveTime();

          this.$router.push(this.$route.query.return_uri || '/');
        });
    },
  },
  async created() {
    await this.login();
  },
  mounted() {
    this.$M.AutoInit();
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/styles";
</style>
