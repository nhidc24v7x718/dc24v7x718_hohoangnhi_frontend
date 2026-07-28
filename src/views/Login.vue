<template>
  <div class="login-page">
    <div class="card login-card">
      <div class="card-body">
        <h3 class="text-center mb-4">
          <i class="fas fa-user-lock"></i>
          Đăng nhập
        </h3>

        <form @submit.prevent="submitLogin">
          <div class="form-group">
            <label for="username"> Tên đăng nhập </label>

            <input
              id="username"
              v-model.trim="credentials.username"
              type="text"
              class="form-control"
              placeholder="Nhập tên đăng nhập"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="password"> Mật khẩu </label>

            <div class="input-group">
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Nhập mật khẩu"
                autocomplete="current-password"
              />

              <div class="input-group-append">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="showPassword = !showPassword"
                >
                  <i
                    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="message" class="alert alert-danger">
            {{ message }}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            :disabled="loading"
          >
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i>
              Đang đăng nhập...
            </span>

            <span v-else>
              <i class="fas fa-sign-in-alt"></i>
              Đăng nhập
            </span>
          </button>
        </form>

        <div class="mt-3 text-muted text-center">
          Tài khoản kiểm tra:
          <strong>admin</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  data() {
    return {
      credentials: {
        username: "",
        password: "",
      },

      showPassword: false,
      loading: false,
      message: "",
    };
  },

  methods: {
    async submitLogin() {
      this.message = "";

      if (!this.credentials.username || !this.credentials.password) {
        this.message = "Vui lòng nhập tên đăng nhập và mật khẩu.";

        return;
      }

      this.loading = true;

      try {
        await AuthService.login(this.credentials);

        const redirect = this.$route.query.redirect || "/";

        this.$router.push(redirect);
      } catch (error) {
        this.message = error.response?.data?.message || "Không thể đăng nhập.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 100%;
  max-width: 420px;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}
</style>
