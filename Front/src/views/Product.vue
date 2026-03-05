<template>
  <div v-if="store.currentProduct" class="product">
    <div class="product-nav">
      <button @click="goToPrev" :disabled="!hasPrev" class="nav-btn">← Предыдущий</button>
      <span class="counter">{{ currentIndex + 1 }} / {{ store.products.length }}</span>
      <button @click="goToNext" :disabled="!hasNext" class="nav-btn">Следующий →</button>
    </div>

    <div class="main">
      <div class="image-large"><span>Фото товара</span></div>
      <div class="info">
        <h1>{{ store.currentProduct.name }}</h1>
        <p class="category">{{ store.currentProduct.category?.name }}</p>
        <p class="price">{{ store.currentProduct.price }} ₽</p>
        
        <div class="description" v-if="store.currentProduct.description">
          <h3>Описание</h3>
          <p>{{ store.currentProduct.description }}</p>
        </div>
        
        <div class="specs" v-if="hasSpecs">
          <h3>Характеристики</h3>
          <ul>
            <li v-if="store.currentProduct.material"><span>Состав:</span> {{ store.currentProduct.material }}</li>
            <li v-if="store.currentProduct.country"><span>Страна:</span> {{ store.currentProduct.country }}</li>
            <li v-if="store.currentProduct.season"><span>Сезон:</span> {{ store.currentProduct.season }}</li>
            <li v-if="store.currentProduct.color"><span>Цвет:</span> {{ store.currentProduct.color }}</li>
            <li v-if="store.currentProduct.sizes"><span>Размеры:</span> {{ store.currentProduct.sizes }}</li>
          </ul>
        </div>
        
        <button @click="addToCart" class="btn">В корзину</button>
        <router-link to="/cart" class="link-cart">Перейти в корзину →</router-link>
      </div>
    </div>

    <div class="similar" v-if="store.similarProducts.length">
      <h2>Похожие товары</h2>
      <div class="grid">
        <ProductCard v-for="p in store.similarProducts" :key="p.id" :product="p" />
      </div>
    </div>
  </div>
  <div v-else class="loading">Загрузка...</div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShopStore } from '../stores/shop'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const store = useShopStore()

const hasSpecs = computed(() => {
  const p = store.currentProduct
  return p && (p.material || p.country || p.season || p.color || p.sizes)
})

const currentIndex = computed(() => store.products.findIndex(p => p.id === route.params.id))
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < store.products.length - 1 && currentIndex.value !== -1)

const goToPrev = () => {
  const prev = store.products[currentIndex.value - 1]
  if (prev) router.push(`/product/${prev.id}`)
}

const goToNext = () => {
  const next = store.products[currentIndex.value + 1]
  if (next) router.push(`/product/${next.id}`)
}

watch(() => route.params.id, (id) => { if (id) store.fetchProduct(id) })

onMounted(() => {
  if (store.products.length === 0) store.fetchProducts()
  store.fetchProduct(route.params.id)
})

const addToCart = () => store.addToCart(store.currentProduct)
</script>

<style scoped>
.product { max-width: 1000px; margin: 0 auto; }
.product-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 1rem; background: white; border-radius: 8px; }
.nav-btn { padding: 0.7rem 1.2rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
.nav-btn:hover:not(:disabled) { background: #2980b9; }
.nav-btn:disabled { background: #bdc3c7; cursor: not-allowed; }
.counter { color: #666; font-weight: bold; }
.main { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem; background: white; padding: 2rem; border-radius: 8px; }
.image-large { width: 100%; height: 400px; background: #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 1.2rem; }
.info h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #333; }
.category { color: #666; margin-bottom: 1rem; }
.price { font-size: 2.5rem; color: #27ae60; font-weight: bold; margin-bottom: 1.5rem; }
.description, .specs { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #eee; }
.description h3, .specs h3 { font-size: 1.1rem; margin-bottom: 0.8rem; color: #333; }
.description p { color: #555; line-height: 1.6; }
.specs ul { list-style: none; }
.specs li { padding: 0.5rem 0; color: #555; border-bottom: 1px dashed #eee; }
.specs li:last-child { border-bottom: none; }
.specs span { font-weight: bold; color: #333; display: inline-block; width: 160px; }
.btn { padding: 1rem 2rem; background: #27ae60; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; margin-bottom: 1rem; }
.btn:hover { background: #219a52; }
.link-cart { display: block; color: #3498db; text-decoration: none; }
.link-cart:hover { text-decoration: underline; }
.similar { background: white; padding: 2rem; border-radius: 8px; }
.similar h2 { margin-bottom: 1.5rem; color: #333; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
.loading { text-align: center; padding: 3rem; color: #666; }
</style>