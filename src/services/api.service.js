import axios from "axios";

const TOKEN_KEY = "contactbook_token";
const USER_KEY = "contactbook_user";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default function createApiClient(baseURL) {
  const api = axios.create({
    baseURL,
    ...commonConfig,
  });

  /*
   * Tự động gắn JWT vào mọi request
   * nếu người dùng đã đăng nhập.
   */
  api.interceptors.request.use(
    (config) => {
      const token =
        localStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;
    },

    (error) => {
      return Promise.reject(error);
    }
  );

  /*
   * Khi token hết hạn hoặc không hợp lệ,
   * xóa phiên đăng nhập và chuyển về /login.
   */
  api.interceptors.response.use(
    (response) => response,

    (error) => {
      const status =
        error.response?.status;

      const token =
        localStorage.getItem(TOKEN_KEY);

      if (status === 401 && token) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        if (
          window.location.pathname !==
          "/login"
        ) {
          window.location.assign("/login");
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}