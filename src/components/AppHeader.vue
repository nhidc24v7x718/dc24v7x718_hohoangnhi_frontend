<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <router-link :to="{ name: 'contactbook' }" class="navbar-brand">
      Ứng dụng Quản lý danh bạ
    </router-link>

    <div class="mr-auto navbar-nav">
      <li class="nav-item">
        <router-link :to="{ name: 'contactbook' }" class="nav-link">
          Danh bạ
          <i class="fas fa-address-book"></i>
        </router-link>
      </li>
    </div>

    <div v-if="user" class="ml-auto navbar-nav align-items-center">
      <span class="navbar-text mr-3">
        <i class="fas fa-user-circle"></i>
        {{ user.username }}
      </span>

      <button
        type="button"
        class="btn btn-sm btn-outline-light"
        @click="logout"
      >
        <i class="fas fa-sign-out-alt"></i>
        Đăng xuất
      </button>
    </div>
  </nav>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  data() {
    return {
      user: null,
    };
  },

  watch: {
    $route: {
      immediate: true,

      handler() {
        this.user = AuthService.getUser();
      },
    },
  },

  methods: {
    logout() {
      const reply = window.confirm("Bạn có muốn đăng xuất?");

      if (!reply) {
        return;
      }

      AuthService.logout();

      this.$router.push({
        name: "login",
      });
    },
  },
};
</script>
