<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()

const route = useRoute()
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    isSidebarOpen.value = false
  },
)
</script>

<template>
  <div class="service-shell">
    <aside class="service-sidebar" :class="{ 'service-sidebar--open': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="brand">
          <img src="/public/logo.svg" alt="logo" style="width: 45px; height: 45px;"/>
          <div>
            <p class="brand__title">Trio Promo</p>
            <p class="brand__subtitle">Admin panel</p>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link class="nav-link" to="/service/dashboard">Dashboard</router-link>
        <router-link class="nav-link" to="/service/promocodes">Promokodlar</router-link>
        <router-link class="nav-link" to="/service/participants">Ishtirokchilar</router-link>
      </nav>

      <div class="sidebar-footer">
        <p class="footer-label">Tezkor menyu</p>
        <div class="footer-links">
          <router-link class="footer-link" to="/">Ro'yxatdan o'tish</router-link>
<!--          <router-link class="footer-link" to="/discounts">Chegirmalar</router-link>-->
        </div>
      </div>
    </aside>

    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <div class="service-main">
      <header class="service-topbar">
        <button class="menu-button" type="button" @click="toggleSidebar">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="topbar-text">
          <p v-if="props.eyebrow" class="eyebrow">{{ props.eyebrow }}</p>
          <h1>{{ props.title }}</h1>
          <p v-if="props.subtitle" class="subtitle">{{ props.subtitle }}</p>
        </div>
        <div class="topbar-actions">
          <slot name="actions"></slot>
        </div>
      </header>

      <main class="service-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<style scoped>
.service-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(220px, 260px) 1fr;
  background: #f8fafc;
}

.service-sidebar {
  background: #0f172a;
  color: #e2e8f0;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  display: grid;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand__mark {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #4f46e5 0%, #22d3ee 100%);
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.brand__title {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.brand__subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.sidebar-nav {
  display: grid;
  gap: 12px;
}

.nav-link {
  padding: 12px 14px;
  border-radius: 14px;
  color: #cbd5f5;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link.router-link-active {
  background: rgba(99, 102, 241, 0.18);
  color: #fff;
}

.nav-link:hover {
  background: rgba(148, 163, 184, 0.16);
  color: #fff;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.footer-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94a3b8;
}

.footer-links {
  display: grid;
  gap: 8px;
}

.footer-link {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.footer-link:hover {
  color: #fff;
}

.service-main {
  padding: 32px 40px 48px;
  display: grid;
  gap: 28px;
  height: min-content;
}

.service-topbar {
  background: #ffffff;
  border-radius: 24px;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
}

.menu-button {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  display: none;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-direction: column;
  cursor: pointer;
}

.menu-button span {
  width: 18px;
  height: 2px;
  background: #1e293b;
  border-radius: 999px;
}

.topbar-text {
  display: grid;
  gap: 6px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

h1 {
  font-size: 26px;
  color: #0f172a;
}

.subtitle {
  color: #64748b;
  font-size: 15px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
}

.service-content {
  display: grid;
  gap: 24px;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 1024px) {
  .service-shell {
    grid-template-columns: 1fr;
  }

  .service-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: min(280px, 80vw);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    z-index: 20;
  }

  .service-sidebar--open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    z-index: 10;
  }

  .service-main {
    padding: 24px;
    height: min-content;
  }

  .service-topbar {
    grid-template-columns: auto 1fr;
  }

  .menu-button {
    display: inline-flex;
  }

  .topbar-actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .service-main {
    padding: 20px 16px 32px;
    height: min-content;
  }

  h1 {
    font-size: 22px;
  }
}
</style>
