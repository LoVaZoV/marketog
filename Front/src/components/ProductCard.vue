<template>
  <div class="card" @click="goToProduct">
    <div class="image-placeholder"><span>Фото</span></div>
    <h3>{{ product.name }}</h3>
    <p class="price">{{ product.price }} ₽</p>
    <button @click.stop="addToCart" class="btn">В корзину</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useShopStore } from '../stores/shop'

const props = defineProps({ product: Object })
const router = useRouter()
const store = useShopStore()

const goToProduct = () => router.push(`/product/${props.product.id}`)
const addToCart = () => store.addToCart(props.product)
</script>

<style scoped>
.card { background: white; border-radius: 8px; padding: 1rem; cursor: pointer; transition: box-shadow 0.2s; border: 1px solid #e0e0e0; }
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.image-placeholder { width: 100%; height: 200px; background: #e0e0e0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; margin-bottom: 1rem; }
h3 { font-size: 1rem; margin-bottom: 0.5rem; color: #333; }
.price { color: #27ae60; font-weight: bold; font-size: 1.2rem; margin-bottom: 1rem; }
.btn { width: 100%; padding: 0.7rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.btn:hover { background: #2980b9; }
</style>