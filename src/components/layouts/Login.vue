<script>
export default {
  methods: {
    async login() {
      await auth.getIdentity()
        .then((response) => {
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
