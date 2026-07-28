import createApiClient from "./api.service";

const TOKEN_KEY = "contactbook_token";
const USER_KEY = "contactbook_user";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(credentials) {
    const response = await this.api.post(
      "/login",
      credentials
    );

    const data = response.data;

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data.user)
    );

    return data;
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser() {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  isAuthenticated() {
    return Boolean(this.getToken());
  }
}

export default new AuthService();