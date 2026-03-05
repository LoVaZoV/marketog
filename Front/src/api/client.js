import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Категории
export const getCategories = () => api.get('/categories')

// Товары
export const getProducts = (categoryId = '') => api.get('/products', { params: categoryId ? { category: categoryId } : {} })
export const getProduct = (id) => api.get(`/products/${id}`)
export const getSimilarProducts = (id) => api.get(`/products/${id}/similar`)

// Заказы
export const createOrder = (data) => api.post('/orders', data)

// Аналитика
export const getTopProducts = () => api.get('/analytics/top-products')

// Пользователи
export const registerUser = (data) => api.post('/users/register', data)
export const getUserByEmail = (email) => api.get(`/users/${email}`)
export const getUserOrders = (id) => api.get(`/users/${id}/orders`)

// Админ
export const getAllOrders = () => api.get('/admin/orders')
export const getAdminStats = () => api.get('/admin/stats')
export const updateOrderStatus = (id, status) => api.patch(`/admin/orders/${id}`, { status })