import { defineStore } from "pinia";

import {
  getCategories,
  getProducts,
  getProduct,
  getSimilarProducts,
  createOrder,
  getTopProducts,
  registerUser,
  getUserByEmail,
  getUserOrders,
  getAllOrders,
  getAdminStats,
  updateOrderStatus,
  createProduct,
} from "../api/client";

export const useShopStore = defineStore("shop", {
  state: () => ({
    products: [],
    categories: [],
    cart: [],
    currentProduct: null,
    similarProducts: [],
    topProducts: [],
    user: null,
    userOrders: [],
    adminOrders: [],
    adminStats: null,
  }),

  getters: {
    cartTotal: (state) =>
      state.cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    cartCount: (state) =>
      state.cart.reduce((sum, item) => sum + item.quantity, 0),
  },

  actions: {
    async fetchCategories() {
      const { data } = await getCategories();
      this.categories = data;
    },

    async fetchProducts(categoryId = "") {
      const { data } = await getProducts(categoryId);
      this.products = data;
    },

    async fetchProduct(id) {
      const { data } = await getProduct(id);
      this.currentProduct = data;
      const similar = await getSimilarProducts(id);
      this.similarProducts = similar.data;
    },

    addToCart(product) {
      const existing = this.cart.find((i) => i.product.id === product.id);
      if (existing) existing.quantity++;
      else this.cart.push({ product, quantity: 1 });
      this.saveCart();
    },

    removeFromCart(productId) {
      this.cart = this.cart.filter((i) => i.product.id !== productId);
      this.saveCart();
    },

    clearCart() {
      this.cart = [];
      localStorage.removeItem("cart");
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    loadCart() {
      const saved = localStorage.getItem("cart");
      if (saved) this.cart = JSON.parse(saved);
    },

    async checkout(customerEmail) {
      const items = this.cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      }));
      await createOrder({ customerEmail, items, userId: this.user?.id });
      this.clearCart();
      if (this.user?.id) await this.fetchUserOrders(this.user.id);
    },

    async fetchAnalytics() {
      const { data } = await getTopProducts();
      this.topProducts = data;
    },

    async registerUser(email, name) {
      const { data } = await registerUser({ email, name });
      this.user = data;
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    },

    async loginUser(email) {
      const { data } = await getUserByEmail(email);
      if (data) {
        this.user = data;
        this.userOrders = data.orders || [];
        localStorage.setItem("user", JSON.stringify(data));
      }
      return data;
    },

    logoutUser() {
      this.user = null;
      this.userOrders = [];
      localStorage.removeItem("user");
    },

    loadUser() {
      const saved = localStorage.getItem("user");
      if (saved) {
        this.user = JSON.parse(saved);
        if (this.user.id) this.fetchUserOrders(this.user.id);
      }
    },

    async fetchUserOrders(userId) {
      const { data } = await getUserOrders(userId);
      this.userOrders = data;
    },

    async fetchAdminOrders() {
      const { data } = await getAllOrders();
      this.adminOrders = data;
    },

    async fetchAdminStats() {
      const { data } = await getAdminStats();
      this.adminStats = data;
    },

    async updateOrderStatus(orderId, status) {
      await updateOrderStatus(orderId, status);
      await this.fetchAdminOrders();
    },

    async createProduct(productData) {
      const { data } = await createProduct(productData);
      this.products.unshift(data);
      return data;
    },
  },
});
