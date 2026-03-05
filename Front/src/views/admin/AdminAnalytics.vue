<template>
  <AdminLayout>
    <div class="admin-analytics">
      <h1>Аналитика продаж</h1>

      <!-- Фильтры -->
      <div class="filters">
        <select v-model="statusFilter" @change="filterOrders">
          <option value="">Все статусы</option>
          <option value="new">Новые</option>
          <option value="paid">Оплаченные</option>
          <option value="processing">В обработке</option>
          <option value="shipped">Отправленные</option>
          <option value="delivered">Доставленные</option>
          <option value="cancelled">Отменённые</option>
        </select>
        
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск по email..."
          @input="filterOrders"
        />
      </div>

      <!-- Сводка -->
      <div class="summary" v-if="filteredOrders.length > 0">
        <div class="summary-item">
          <span>Показано:</span>
          <strong>{{ filteredOrders.length }} заказов</strong>
        </div>
        <div class="summary-item">
          <span>Общая сумма:</span>
          <strong>{{ totalFiltered }} ₽</strong>
        </div>
      </div>

      <!-- Таблица заказов -->
      <div class="orders-section">
        <h2>Все заказы</h2>
        
        <div v-if="loading" class="loading">Загрузка...</div>
        
        <div v-else-if="filteredOrders.length === 0" class="empty">
          Заказы не найдены
        </div>
        
        <div v-else class="orders-list">
          <div 
            v-for="order in filteredOrders" 
            :key="order.id" 
            class="order-card"
            :class="{ expanded: expandedOrder === order.id }"
          >
            <div class="order-header" @click="toggleExpand(order.id)">
              <div class="order-main">
                <span class="order-num">#{{ order.id.slice(-6) }}</span>
                <span class="order-email">{{ order.customerEmail }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="order-meta">
                <span class="order-total">{{ order.total }} ₽</span>
                <select 
                  v-model="order.status" 
                  @click.stop
                  @change="updateStatus(order.id, order.status)"
                  class="status-select"
                >
                  <option value="new">Новый</option>
                  <option value="paid">Оплачен</option>
                  <option value="processing">В обработке</option>
                  <option value="shipped">Отправлен</option>
                  <option value="delivered">Доставлен</option>
                  <option value="cancelled">Отменён</option>
                </select>
                <span class="expand-icon">
                  {{ expandedOrder === order.id ? '▼' : '▶' }}
                </span>
              </div>
            </div>

            <!-- Детали заказа -->
            <div v-if="expandedOrder === order.id" class="order-details">
              <h4>Состав заказа:</h4>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Категория</th>
                    <th>Кол-во</th>
                    <th>Цена</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.id">
                    <td>{{ item.product?.name || 'Товар удалён' }}</td>
                    <td>{{ item.product?.category?.name || '-' }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.price }} ₽</td>
                    <td>{{ item.quantity * item.price }} ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Топ товаров -->
      <div class="top-products">
        <h2>Топ-10 продаваемых товаров</h2>
        
        <div v-if="topProducts.length === 0" class="empty">
          Нет данных о продажах
        </div>
        
        <div v-else class="top-list">
          <div 
            v-for="(item, index) in topProducts" 
            :key="item.product.id"
            class="top-item"
          >
            <span class="top-place">{{ index + 1 }}</span>
            <span class="top-name">{{ item.product.name }}</span>
            <span class="top-qty">{{ item.totalSold }} шт.</span>
            <span class="top-revenue">{{ item.revenue }} ₽</span>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useShopStore } from '../../stores/shop'
import AdminLayout from './AdminLayout.vue'

const store = useShopStore()

const statusFilter = ref('')
const searchQuery = ref('')
const expandedOrder = ref(null)
const loading = ref(false)
const filteredOrders = ref([])

onMounted(async () => {
  loading.value = true
  await store.fetchAdminOrders()
  filterOrders()
  loading.value = false
})

const filterOrders = () => {
  let result = store.adminOrders || []
  
  // Фильтр по статусу
  if (statusFilter.value) {
    result = result.filter(o => o.status === statusFilter.value)
  }
  
  // Поиск по email
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(o => 
      o.customerEmail?.toLowerCase().includes(query)
    )
  }
  
  filteredOrders.value = result
}

const totalFiltered = computed(() => {
  return filteredOrders.value.reduce((sum, o) => sum + Number(o.total || 0), 0)
})

const topProducts = computed(() => {
  // Считаем продажи по товарам
  const sales = {}
  
  ;(store.adminOrders || []).forEach(order => {
    ;(order.items || []).forEach(item => {
      if (!item.product) return
      const id = item.productId
      if (!sales[id]) {
        sales[id] = {
          product: item.product,
          totalSold: 0,
          revenue: 0
        }
      }
      sales[id].totalSold += item.quantity || 0
      sales[id].revenue += (item.quantity || 0) * Number(item.price || 0)
    })
  })

  return Object.values(sales)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 10)
})

const toggleExpand = (id) => {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

const updateStatus = async (orderId, status) => {
  try {
    await store.updateOrderStatus(orderId, status)
  } catch (error) {
    console.error('Ошибка обновления статуса:', error)
    alert('Не удалось обновить статус')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.admin-analytics {
  max-width: 1200px;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

/* Фильтры */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters select,
.filters input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filters input {
  flex: 1;
}

/* Сводка */
.summary {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #ecf0f1;
  border-radius: 4px;
}

.summary-item span {
  color: #7f8c8d;
  margin-right: 0.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Заказы */
.orders-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.orders-section h2 {
  margin-bottom: 1rem;
  color: #333;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.order-card {
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.order-card.expanded {
  border-color: #3498db;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background: #f8f9fa;
}

.order-header:hover {
  background: #ecf0f1;
}

.order-main {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.order-num {
  font-weight: bold;
  color: #3498db;
}

.order-email {
  color: #2c3e50;
}

.order-date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.order-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.order-total {
  font-weight: bold;
  color: #27ae60;
  font-size: 1.1rem;
}

.status-select {
  padding: 0.3rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.expand-icon {
  color: #7f8c8d;
}

/* Детали заказа */
.order-details {
  padding: 1rem;
  border-top: 1px solid #ecf0f1;
  background: white;
}

.order-details h4 {
  margin-bottom: 0.8rem;
  color: #333;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.items-table th,
.items-table td {
  padding: 0.7rem;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.items-table th {
  color: #7f8c8d;
  font-weight: 600;
}

/* Топ товаров */
.top-products {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.top-products h2 {
  margin-bottom: 1rem;
  color: #333;
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.top-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.top-place {
  width: 30px;
  height: 30px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.top-name {
  flex: 1;
  color: #2c3e50;
}

.top-qty {
  color: #7f8c8d;
  margin-right: 1.5rem;
}

.top-revenue {
  font-weight: bold;
  color: #27ae60;
  min-width: 100px;
  text-align: right;
}
</style>