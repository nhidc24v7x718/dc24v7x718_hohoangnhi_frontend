<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  components: {
    AppHeader,
  },

  computed: {
    showHeader() {
      return this.$route.name !== "login";
    },
  },
};
</script>

<template>
  <div id="app">
    <AppHeader v-if="showHeader" />

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<style>
.page {
  max-width: 400px;
  margin: auto;
}
</style>
