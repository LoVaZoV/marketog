<template>
  <div class="profile">
    <div v-if="!store.user" class="auth">
      <div class="tabs">
        <button :class="{ active: activeTab === 'login' }" @click="activeTab = 'login'">Вход</button>
        <button :class="{ active: activeTab === 'register' }" @click="activeTab = 'register'">Регистрация</button>
      </div>

      <form v-if="activeTab === 'login'" @submit.prevent="login" class="form">
        <h2>Вход в аккаунт</h2>
        <input v-model="loginEmail" type="email" placeholder="Ваш email" required />
        <button type="submit" class="btn-primary">Войти</button>
        <p class="hint">Для теста: ivan@mail.ru или maria@mail.ru</p>
      </form>

      <form v-else @submit.prevent="register" class="form">
        <h2>Создать аккаунт</h2>
        <input v-model="regName" type="text" placeholder="Ваше имя" required />
        <input v-model="regEmail" type="email" placeholder="Ваш email" required />
        <button type="submit" class="btn-primary">Зарегистрироваться</button>
      </form>
    </div>

    <div v-else class="profile-info">
      <div class="header">
        <div>
          <h1>{{ store.user.name }}</h1>
          <p class="email">{{ store.user.email }}</p>
          <p v-if="store.user.phone" class="phone">{{ store.user.phone }}</p>
        </div>
        <button @click="logout" class="btn-logout">Выйти</button>
      </div>

      <div class="orders">
        <h2>История заказов</h2>
        <div v-if="store.userOrders.length === 0" class="empty">У вас пока нет заказов</div>
        <div v-else class="orders-list">
          <div v-for="order in store.userOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-num">Заказ №{{ order.id.slice(-6) }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              <span :class="['status', order.status]">{{ getStatus(order.status) }}</span>
            </div>
            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="item">
                <span class="item-name">{{ item.product.name }}</span>
                <span class="item-qty">{{ item.quantity }} шт.</span>
                <span class="item-price">{{ item.price }} ₽</span>
              </div>
            </div>
            <div class="order-total">Итого: <strong>{{ order.total }} ₽</strong></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useShopStore } from '../stores/shop'

const store = useShopStore()
const activeTab = ref('login')
const loginEmail = ref('')
const regName = ref('')
const regEmail = ref('')

onMounted(() => store.loadUser())

const login = async () => {
  const user = await store.loginUser(loginEmail.value)
  if (!user) alert('Пользователь не найден. Попробуйте зарегистрироваться.')
}

const register = async () => {
  await store.registerUser(regEmail.value, regName.value)
  alert('Аккаунт создан! Теперь войдите.')
  activeTab.value = 'login'
}

const logout = () => store.logoutUser()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getStatus = (status) => {
  const statuses = { 'new': 'Новый', 'paid': 'Оплачен', 'processing': 'В обработке', 'shipped': 'Отправлен', 'delivered': 'Доставлен', 'cancelled': 'Отменён' }
  return statuses[status] || status
}
</script>

<style scoped>
.profile { max-width: 800px; margin: 0 auto; }
.tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.tabs button { padding: 0.8rem 1.5rem; background: white; border: 2px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.tabs button.active { background: #3498db; color: white; border-color: #3498db; }
.auth { background: white; padding: 2rem; border-radius: 8px; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.form h2 { margin-bottom: 0.5rem; color: #333; }
.form input { padding: 1rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; }
.btn-primary { padding: 1rem; background: #27ae60; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; }
.btn-primary:hover { background: #219a52; }
.hint { color: #666; font-size: 0.9rem; }
.profile-info { background: white; padding: 2rem; border-radius: 8px; }
.header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }
.header h1 { color: #333; margin-bottom: 0.3rem; }
.email { color: #666; }
.phone { color: #3498db; margin-top: 0.3rem; }
.btn-logout { padding: 0.7rem 1.5rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
.orders h2 { margin-bottom: 1.5rem; color: #333; }
.empty { text-align: center; padding: 3rem; color: #666; background: #f8f9fa; border-radius: 4px; }
.order-card { border: 1px solid #eee; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }
.order-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px dashed #eee; }
.order-num { font-weight: bold; color: #333; }
.order-date { color: #666; }
.status { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
.status.new { background: #fff3cd; color: #856404; }
.status.paid { background: #d4edda; color: #155724; }
.status.processing { background: #cce5ff; color: #004085; }
.status.shipped { background: #d1ecf1; color: #0c5460; }
.status.delivered { background: #d4edda; color: #155724; }
.status.cancelled { background: #f8d7da; color: #721c24; }
.order-items { margin-bottom: 1rem; }
.item { display: flex; justify-content: space-between; padding: 0.5rem 0; color: #555; }
.item-name { flex: 1; }
.item-qty { color: #666; margin: 0 1rem; }
.item-price { font-weight: bold; color: #333; }
.order-total { text-align: right; font-size: 1.2rem; padding-top: 1rem; border-top: 2px solid #eee; }
.order-total strong { color: #27ae60; }
</style>