<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">Админка</div>
      <nav>
        <router-link to="/admin" :class="{ active: $route.path === '/admin' }"
          >📊 Профиль</router-link
        >

        <router-link
          to="/admin/analytics"
          :class="{ active: $route.path === '/admin/analytics' }"
          >📈 Аналитика</router-link
        >

        <router-link
          to="/admin/add-product"
          :class="{ active: $route.path === '/admin/add-product' }"
          >➕ Добавить товар</router-link
        >

        <router-link
          to="/admin/delete-product"
          :class="{ active: $route.path === '/admin/delete-product' }"
          >❌ Удалить товар</router-link
        >

        <router-link
          to="/admin/delete-product"
          :class="{ active: $route.path === '/admin/delete-product' }"
          >👥 Сотрудники</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >📔 Подрядчики</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >📦 Учет товара</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >📞 Поддержка</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >🔔 Уведомление</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >🔴 Увольнение</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >✈️ Отпуск</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >🤝 Пользователи/клиенты</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Доставка</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >отзовы</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Заказы</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Маркетинг</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Финансы</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Настройки</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Корпаратив/командировка</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Документы</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Интсрукия сотрудника</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Дело сотрудника</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Предложение/жалобы/претензии</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Материально-техническое обеспечение (МТО)</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Календарь</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Зарплата</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >График работы</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Планирование</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление задачами</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление проектами</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление временем</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление ресурсами</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление бюджетом</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление рисками</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление качеством</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление коммуникациями</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление закупками</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление заинтересованными сторонами</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Управление изменениями</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Безопасность</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Партнеры</router-link
        >
        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >Роли</router-link
        >

        <router-link
          to="/admin/support"
          :class="{ active: $route.path === '/admin/support' }"
          >...</router-link
        >
      </nav>
      <router-link to="/" class="back">← В магазин</router-link>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #34495e;
}
nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
nav a {
  padding: 1rem;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}
nav a:hover,
nav a.active {
  background: #34495e;
}
.back {
  padding: 1rem;
  color: #bdc3c7;
  text-decoration: none;
  border-top: 1px solid #34495e;
  margin-top: auto;
}
.back:hover {
  color: white;
}
.content {
  flex: 1;
  padding: 2rem;
  background: #f5f5f5;
  overflow-y: auto;
}
</style>
