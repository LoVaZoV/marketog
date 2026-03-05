<template>
  <div>
    <h1>Корзина</h1>
    <div v-if="store.cart.length === 0" class="empty">
      <p>Корзина пуста</p>
      <router-link to="/" class="btn-back">Вернуться в каталог</router-link>
    </div>
    <div v-else>
      <div class="items">
        <div v-for="item in store.cart" :key="item.product.id" class="item">
          <div class="item-info">
            <h3>{{ item.product.name }}</h3>
            <p class="item-price">{{ item.product.price }} ₽ x {{ item.quantity }}</p>
            <p class="item-total">Сумма: {{ item.product.price * item.quantity }} ₽</p>
          </div>
          <button @click="remove(item.product.id)" class="btn-remove">Удалить</button>
        </div>
      </div>
      <div class="total">
        <h2>Итого: {{ store.cartTotal }} ₽</h2>
        <router-link to="/checkout" class="btn-checkout">Оформить заказ</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useShopStore } from '../stores/shop'
const store = useShopStore()
const remove = (id) => store.removeFromCart(id)
</script>

<style scoped>
h1 { margin-bottom: 1.5rem; color: #333; }
.empty { text-align: center; padding: 3rem; background: white; border-radius: 8px; }
.empty p { color: #666; margin-bottom: 1rem; font-size: 1.1rem; }
.btn-back { display: inline-block; padding: 0.7rem 1.5rem; background: #3498db; color: white; text-decoration: none; border-radius: 4px; }
.items { background: white; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem; }
.item { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #eee; }
.item:last-child { border-bottom: none; }
.item-info h3 { margin-bottom: 0.5rem; color: #333; }
.item-price { color: #666; margin-bottom: 0.3rem; }
.item-total { color: #27ae60; font-weight: bold; }
.btn-remove { background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.btn-remove:hover { background: #c0392b; }
.total { background: white; padding: 1.5rem; border-radius: 8px; text-align: right; }
.total h2 { margin-bottom: 1rem; color: #333; }
.btn-checkout { display: inline-block; padding: 1rem 2rem; background: #27ae60; color: white; text-decoration: none; border-radius: 4px; font-size: 1.1rem; }
.btn-checkout:hover { background: #219a52; }
</style>