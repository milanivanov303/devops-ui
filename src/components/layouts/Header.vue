<template>
  <header>
    <Navbar />
    <Sidebar />
  </header>
</template>

<script>
import Navbar from "@/components/layouts/Navbar.vue";
import Sidebar from "@/components/layouts/Sidebar.vue";

export default {
  components: {
    Navbar,
    Sidebar
  }
};
</script>
