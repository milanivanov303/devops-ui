<template>
  <div>
    <Modal v-if="showInactiveUserModal" @close="resetInactiveUserAction">
      <template v-slot:header>
        Your session has expired
      </template>
      <template v-slot:content>

      </template>
    </Modal>
  </div>
</template>

<script lang="js">
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["strToTime"] }] */

import config from "@/config";

export default {
  data() {
    return {
      userActivityThrottlerTimeout: null,
      userActivityTimeout: null,
      showInactiveUserModal: false,
    };
  },

  computed: {
    inactiveUserTime() {
      return this.strToTime(config.auth.session_expire);
    },

    userActivityThrottlerTime() {
      return this.strToTime('1 second');
    },
  },

  methods: {
    strToTime(string) {
      const integer = parseInt(string, 10);

      if (string.match('hour')) {
        return integer * 60 * 60 * 1000;
      }

      if (string.match('minute')) {
        return integer * 60 * 1000;
      }

      if (string.match('second')) {
        return integer * 1000;
      }

      return integer;
    },

    activateActivityTracker() {
      window.addEventListener("mousemove", this.userActivityThrottler);
      window.addEventListener("scroll", this.userActivityThrottler);
      window.addEventListener("keydown", this.userActivityThrottler);
      window.addEventListener("resize", this.userActivityThrottler);
    },

    resetUserActivityTimeout() {
      clearTimeout(this.userActivityTimeout);

      this.userActivityTimeout = setTimeout(
        () => {
          this.inactiveUserAction();
        },
        this.inactiveUserTime
      );
    },

    userActivityThrottler() {
      if (this.userActivityThrottlerTimeout) {
        return;
      }

      this.userActivityThrottlerTimeout = setTimeout(
        () => {
          this.resetUserActivityTimeout();

          clearTimeout(this.userActivityThrottlerTimeout);
          this.userActivityThrottlerTimeout = null;
        },
        this.userActivityThrottlerTime
      );
    },

    inactiveUserAction() {
      if (!this.$auth.getUser()) {
        return;
      }

      this.showInactiveUserModal = true;
      this.$auth.logout();
    },

    resetInactiveUserAction() {
      this.showInactiveUserModal = false;
      this.$router.go();
    }
  },

  beforeMount() {
    this.activateActivityTracker();
  },

  beforeDestroy() {
    window.removeEventListener("mousemove", this.userActivityThrottler);
    window.removeEventListener("scroll", this.userActivityThrottler);
    window.removeEventListener("keydown", this.userActivityThrottler);
    window.removeEventListener("resize", this.userActivityThrottler);

    clearTimeout(this.userActivityTimeout);
    clearTimeout(this.userActivityThrottlerTimeout);
  },
};
</script>
