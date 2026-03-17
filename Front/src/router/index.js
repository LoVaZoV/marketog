import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/product/:id", component: () => import("../views/Product.vue") },
  { path: "/cart", component: () => import("../views/Cart.vue") },
  { path: "/checkout", component: () => import("../views/Checkout.vue") },
  { path: "/success", component: () => import("../views/Success.vue") },

  { path: "/profile", component: () => import("../views/Profile.vue") },
  {
    path: "/admin",
    component: () => import("../views/admin/AdminProfile.vue"),
  },
  {
    path: "/admin/analytics",
    component: () => import("../views/admin/AdminAnalytics.vue"),
  },
  {
    path: "/admin/add-product",
    component: () => import("../views/admin/AdminAddProduct.vue"),
  },
];

export default createRouter({ history: createWebHistory(), routes });
