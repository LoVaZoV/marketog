<template>
  <div>
    <h1>Каталог одежды</h1>
    <div class="filter">
      <select v-model="selectedCategory" @change="filterProducts">
        <option value="">Все категории</option>
        <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>
    <div v-if="store.products.length === 0" class="loading">Загрузка...</div>
    <div v-else class="grid">
      <ProductCard v-for="product in store.products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useShopStore } from '../stores/shop'
import ProductCard from '../components/ProductCard.vue'

const store = useShopStore()
const selectedCategory = ref('')

onMounted(() => {
  store.fetchCategories()
  store.fetchProducts()
  store.loadCart()
})

const filterProducts = () => store.fetchProducts(selectedCategory.value)
</script>

<style scoped>
h1 { margin-bottom: 1.5rem; color: #333; }
.filter { margin-bottom: 1.5rem; }
select { padding: 0.5rem 1rem; font-size: 1rem; border: 1px solid #ddd; border-radius: 4px; background: white; }
.loading { text-align: center; padding: 3rem; color: #666; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
</style>