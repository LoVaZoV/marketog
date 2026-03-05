<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="logo">Админка</div>
      <nav>
        <router-link to="/admin" :class="{ active: $route.path === '/admin' }">📊 Профиль</router-link>
        <router-link to="/admin/analytics" :class="{ active: $route.path === '/admin/analytics' }">📈 Аналитика</router-link>
      </nav>
      <router-link to="/" class="back">← В магазин</router-link>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.sidebar { width: 250px; background: #2c3e50; color: white; padding: 1.5rem; display: flex; flex-direction: column; }
.logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #34495e; }
nav { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
nav a { padding: 1rem; color: #ecf0f1; text-decoration: none; border-radius: 4px; transition: background 0.2s; }
nav a:hover, nav a.active { background: #34495e; }
.back { padding: 1rem; color: #bdc3c7; text-decoration: none; border-top: 1px solid #34495e; margin-top: auto; }
.back:hover { color: white; }
.content { flex: 1; padding: 2rem; background: #f5f5f5; overflow-y: auto; }
</style>