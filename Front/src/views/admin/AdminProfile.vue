<template>
  <AdminLayout>
    <div class="admin-profile">
      <h1>Профиль администратора</h1>
      
      <!-- Карточки статистики -->
      <div class="stats-grid" v-if="store.adminStats">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <span class="stat-value">{{ store.adminStats.totalRevenue }} ₽</span>
            <span class="stat-label">Общая выручка</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <span class="stat-value">{{ store.adminStats.totalOrders }}</span>
            <span class="stat-label">Всего заказов</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ store.adminStats.totalUsers }}</span>
            <span class="stat-label">Пользователей</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">👁</div>
          <div class="stat-info">
            <span class="stat-value">{{ store.adminStats.totalViews }}</span>
            <span class="stat-label">Просмотров товаров</span>
          </div>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-else class="loading">
        Загрузка статистики...
      </div>

      <!-- Последние заказы -->
      <div class="recent-orders">
        <h2>Последние заказы</h2>
        
        <div v-if="recentOrders.length === 0" class="empty">
          Заказов пока нет
        </div>
        
        <table v-else class="orders-table">
          <thead>
            <tr>
              <th>№ заказа</th>
              <th>Клиент</th>
              <th>Дата</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td>#{{ order.id.slice(-6) }}</td>
              <td>{{ order.customerEmail }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>{{ order.total }} ₽</td>
              <td>
                <span :class="['status', order.status]">
                  {{ getStatus(order.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <router-link to="/admin/analytics" class="btn-all">
          Все заказы →
        </router-link>
      </div>

      <!-- Быстрые действия -->
      <div class="quick-actions">
        <h2>Быстрые действия</h2>
        <div class="actions">
          <button class="action-btn" @click="refreshData">
            🔄 Обновить данные
          </button>
          <button class="action-btn" @click="exportData">
            📥 Экспорт заказов
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useShopStore } from '../../stores/shop'
import AdminLayout from './AdminLayout.vue'

const store = useShopStore()

// Исправлено: используем computed правильно
const recentOrders = computed(() => {
  return store.adminOrders?.slice(0, 5) || []
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    await store.fetchAdminStats()
    await store.fetchAdminOrders()
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  }
}

const refreshData = () => {
  loadData()
}

const exportData = () => {
  const data = JSON.stringify(store.adminOrders, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `orders-${new Date().toISOString().split('T')[0]}.json`
  a.click()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatus = (status) => {
  const statuses = {
    'new': 'Новый',
    'paid': 'Оплачен',
    'processing': 'В обработке',
    'shipped': 'Отправлен',
    'delivered': 'Доставлен',
    'cancelled': 'Отменён'
  }
  return statuses[status] || status
}
</script>

<style scoped>
.admin-profile {
  max-width: 1200px;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: white;
  border-radius: 8px;
  margin-bottom: 2rem;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Заказы */
.recent-orders {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recent-orders h2 {
  margin-bottom: 1rem;
  color: #333;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.orders-table th {
  color: #7f8c8d;
  font-weight: 600;
}

.status {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.status.new { background: #fff3cd; color: #856404; }
.status.paid { background: #d4edda; color: #155724; }
.status.processing { background: #cce5ff; color: #004085; }
.status.shipped { background: #d1ecf1; color: #0c5460; }
.status.delivered { background: #d4edda; color: #155724; }
.status.cancelled { background: #f8d7da; color: #721c24; }

.btn-all {
  display: inline-block;
  margin-top: 1rem;
  color: #3498db;
  text-decoration: none;
}

.btn-all:hover {
  text-decoration: underline;
}

/* Действия */
.quick-actions {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.quick-actions h2 {
  margin-bottom: 1rem;
  color: #333;
}

.actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  background: #ecf0f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #bdc3c7;
}
</style>