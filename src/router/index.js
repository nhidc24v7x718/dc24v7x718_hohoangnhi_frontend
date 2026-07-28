import {
  createWebHistory,
  createRouter,
} from "vue-router";

import ContactBook from "@/views/ContactBook.vue";
import AuthService from "@/services/auth.service";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import("@/views/Login.vue"),

    meta: {
      guestOnly: true,
    },
  },

  {
    path: "/",
    name: "contactbook",
    component: ContactBook,

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/contacts/add",
    name: "contact.add",
    component: () =>
      import("@/views/ContactAdd.vue"),

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/contacts/:id",
    name: "contact.edit",
    component: () =>
      import("@/views/ContactEdit.vue"),

    props: true,

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () =>
      import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes,
});

/*
 * Bảo vệ các trang cần đăng nhập.
 */
router.beforeEach((to) => {
  const authenticated =
    AuthService.isAuthenticated();

  if (
    to.meta.requiresAuth &&
    !authenticated
  ) {
    return {
      name: "login",

      query: {
        redirect: to.fullPath,
      },
    };
  }

  /*
   * Người đã đăng nhập không cần
   * trở lại trang login.
   */
  if (
    to.meta.guestOnly &&
    authenticated
  ) {
    return {
      name: "contactbook",
    };
  }

  return true;
});

export default router;