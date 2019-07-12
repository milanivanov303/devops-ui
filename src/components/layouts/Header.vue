<template>
  <header>
    <Navbar />
    <Sidebar />
  </header>
</template>

<script>
import Navbar from '@/components/layouts/Navbar';
import Sidebar from '@/components/layouts/Sidebar';

export default {
  components: {
    Navbar,
    Sidebar,
  },
};
</script>
