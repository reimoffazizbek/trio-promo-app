<script setup lang="ts">
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const router = useRouter()

const handleLogout = async () => {
  authService.clearSession()
  await router.push('/service/login')
}
</script>

<template>
  <div class="page">
    <header class="header">
      <div>
        <p class="eyebrow">Promokodlar</p>
        <h1>Promokodlar ro'yxati</h1>
        <p class="subtitle">Bu sahifa faqat admin foydalanuvchilar uchun ochiq.</p>
      </div>
      <div class="actions">
        <router-link class="secondary-button" to="/service/dashboard">Dashboard</router-link>
        <button class="ghost-button" type="button" @click="handleLogout">Chiqish</button>
      </div>
    </header>

    <section class="placeholder">
      <h2>Ma'lumotlar tayyorlanmoqda</h2>
      <p>
        Bu yerda promokodlar ro'yxati, filterlar va eksport funksiyalari ko'rsatiladi. Hozircha kirish uchun
        autentifikatsiya himoyasi yoqildi.
      </p>
    </section>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 48px 32px;
  display: grid;
  gap: 28px;
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
  font-size: 26px;
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

.secondary-button,
.ghost-button {
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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

.secondary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}

.placeholder {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px dashed rgba(100, 116, 139, 0.3);
  display: grid;
  gap: 10px;
  color: #475569;
}

.placeholder h2 {
  font-size: 18px;
  color: #0f172a;
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
