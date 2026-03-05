<template>
  <nav class="nav">
    <router-link to="/" class="logo">Магазин</router-link>
    <div class="links">
      <router-link to="/">Каталог</router-link>
      <router-link to="/cart">Корзина ({{ store.cartCount }})</router-link>
      <router-link to="/profile">
        {{ store.user ? store.user.name : 'Профиль' }}
      </router-link>
      <router-link to="/admin" class="admin-link">Админ</router-link>
    </div>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<script setup>
import { useShopStore } from './stores/shop'
const store = useShopStore()
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; background: #f5f5f5; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #333; color: white; }
.nav a { color: white; text-decoration: none; margin-left: 1.5rem; }
.nav a:hover { color: #4fc08d; }
.logo { font-weight: bold; font-size: 1.3rem; }
.admin-link { color: #e74c3c !important; }
main { padding: 2rem; max-width: 1200px; margin: 0 auto; }
</style>