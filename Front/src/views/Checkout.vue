<template>
  <div class="checkout">
    <h1>Оформление заказа</h1>
    <div class="order-summary">
      <h3>Ваш заказ:</h3>
      <div class="items">
        <div v-for="item in store.cart" :key="item.product.id" class="item">
          {{ item.product.name }} — {{ item.quantity }} шт. × {{ item.product.price }} ₽
        </div>
      </div>
      <div class="total-sum"><h2>Итого: {{ store.cartTotal }} ₽</h2></div>
    </div>
    <form @submit.prevent="submit" class="form">
      <div class="form-group">
        <label>Ваш email:</label>
        <input v-model="email" type="email" placeholder="example@mail.ru" required />
      </div>
      <button type="submit" class="btn-submit">Подтвердить заказ</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '../stores/shop'

const store = useShopStore()
const router = useRouter()
const email = ref('')

const submit = async () => {
  try {
    await store.checkout(email.value)
    router.push('/success')
  } catch (error) {
    alert('Ошибка при оформлении заказа')
  }
}
</script>

<style scoped>
.checkout { max-width: 600px; margin: 0 auto; }
h1 { margin-bottom: 1.5rem; color: #333; }
.order-summary { background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; }
.order-summary h3 { margin-bottom: 1rem; color: #666; }
.items { margin-bottom: 1rem; }
.item { padding: 0.7rem 0; border-bottom: 1px solid #eee; }
.item:last-child { border-bottom: none; }
.total-sum { border-top: 2px solid #27ae60; padding-top: 1rem; margin-top: 1rem; }
.total-sum h2 { color: #27ae60; }
.form { background: white; padding: 1.5rem; border-radius: 8px; }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; color: #333; font-weight: bold; }
input { width: 100%; padding: 1rem; font-size: 1rem; border: 1px solid #ddd; border-radius: 4px; }
input:focus { outline: none; border-color: #3498db; }
.btn-submit { width: 100%; padding: 1rem; background: #27ae60; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; }
.btn-submit:hover { background: #219a52; }
</style>