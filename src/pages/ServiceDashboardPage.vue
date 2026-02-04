<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => {
  const user = authStore.authResponse?.data?.user
  if (!user) {
    return 'Admin'
  }
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.phoneNumber || 'Admin'
})

const handleLogout = async () => {
  authService.clearSession()
  await router.push('/service/login')
}
</script>

<template>
  <div class="page">
    <header class="header">
      <div>
        <p class="eyebrow">Admin panel</p>
        <h1>Xush kelibsiz, {{ userName }}</h1>
        <p class="subtitle">Promokodlar bo'limini boshqarish uchun kerakli menyuni tanlang.</p>
      </div>
      <div class="actions">
        <router-link class="secondary-button" to="/service/promocodes">Promokodlar</router-link>
        <button class="ghost-button" type="button" @click="handleLogout">Chiqish</button>
      </div>
    </header>

    <section class="cards">
      <article class="card">
        <h2>Promokodlar</h2>
        <p>Ro'yxatni ko'rish va faollikni tekshirish uchun promokodlar sahifasiga o'ting.</p>
        <router-link class="primary-button" to="/service/promocodes">Promokodlarni ochish</router-link>
      </article>
      <article class="card card--muted">
        <h2>Foydalanuvchi arizalari</h2>
        <p>Bu yerda yangi arizalar va statuslar ko'rsatiladi. (Keyingi bosqich)</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 48px 32px;
  display: grid;
  gap: 32px;
}

.header {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 24px 28px;
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.12);
}

.eyebrow {
  font-size: 14px;
  font-weight: 700;
  color: #4338ca;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  font-size: 28px;
  margin: 6px 0;
  color: #0f172a;
}

.subtitle {
  color: #475569;
  line-height: 1.6;
  max-width: 520px;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button,
.ghost-button {
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-button {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #fff;
  display: inline-flex;
}

.secondary-button {
  background: #eef2ff;
  color: #4338ca;
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.ghost-button {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.primary-button:hover,
.secondary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 22px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  display: grid;
  gap: 12px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
}

.card h2 {
  font-size: 18px;
  color: #0f172a;
}

.card p {
  color: #64748b;
  line-height: 1.6;
}

.card--muted {
  background: #f8fafc;
}

@media (max-width: 640px) {
  .page {
    padding: 32px 20px;
  }

  .header {
    padding: 20px;
  }
}
</style>
