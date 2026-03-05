<template>
  <div class="success">
    <div class="icon">✓</div>
    <h1>Заказ оформлен!</h1>
    <p>Спасибо за покупку. Мы свяжемся с вами по email для подтверждения.</p>
    <router-link to="/" class="btn">Вернуться в каталог</router-link>
  </div>
</template>

<style scoped>
.success { text-align: center; padding: 4rem 2rem; max-width: 500px; margin: 0 auto; }
.icon { width: 80px; height: 80px; background: #27ae60; color: white; font-size: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
h1 { color: #27ae60; margin-bottom: 1rem; }
p { color: #666; margin-bottom: 2rem; line-height: 1.6; }
.btn { display: inline-block; padding: 1rem 2rem; background: #3498db; color: white; text-decoration: none; border-radius: 4px; }
.btn:hover { background: #2980b9; }
</style>