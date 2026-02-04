<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { useAuthStore } from '../stores/auth'
import ServiceLayout from '../components/ServiceLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => {
  const user = authStore.authResponse?.data?.user
  if (!user) {
    return 'Admin'
  }
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.phoneNumber || 'Admin'
})

const topParticipants = [
  { name: 'Azizbek Karimov', phone: '+998 90 123 45 67', registrations: 12 },
  { name: 'Dilnoza Ahmedova', phone: '+998 91 234 56 78', registrations: 10 },
  { name: 'Bekzod Rustamov', phone: '+998 93 345 67 89', registrations: 9 },
  { name: 'Madina Islomova', phone: '+998 94 456 78 90', registrations: 8 },
  { name: 'Javohir Xasanov', phone: '+998 95 567 89 01', registrations: 7 },
]

const latestParticipants = [
  { name: 'Umida Abdullayeva', phone: '+998 90 321 45 67', date: '2024-06-14 10:12' },
  { name: 'Sherzod Qodirov', phone: '+998 91 654 32 10', date: '2024-06-14 09:40' },
  { name: 'Nodira Usmonova', phone: '+998 93 111 22 33', date: '2024-06-14 09:10' },
  { name: 'Farruh Xasanov', phone: '+998 94 222 33 44', date: '2024-06-14 08:55' },
  { name: 'Kamola Rustamova', phone: '+998 95 333 44 55', date: '2024-06-14 08:20' },
  { name: 'Yusuf Karimov', phone: '+998 90 444 55 66', date: '2024-06-14 08:05' },
  { name: 'Lola Tursunova', phone: '+998 91 555 66 77', date: '2024-06-14 07:40' },
  { name: 'Akmal Mirzayev', phone: '+998 93 666 77 88', date: '2024-06-14 07:15' },
  { name: 'Nigora Shavkatova', phone: '+998 94 777 88 99', date: '2024-06-14 06:50' },
  { name: 'Sardor Usmonov', phone: '+998 95 888 99 00', date: '2024-06-14 06:25' },
]

const handleLogout = async () => {
  authService.clearSession()
  await router.push('/service/login')
}
</script>

<template>
  <ServiceLayout
    eyebrow="Dashboard"
    :title="`Xush kelibsiz, ${userName}`"
    subtitle="Admin paneldagi umumiy holat va so'nggi faollikni kuzating."
  >
    <template #actions>
      <button class="ghost-button" type="button" @click="handleLogout">Chiqish</button>
    </template>

    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Top ro'yxatdan o'tgan ishtirokchilar</h2>
            <p class="panel__subtitle">Eng ko'p ro'yxatdan o'tgan ishtirokchilar reytingi.</p>
          </div>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ism</th>
                <th>Telefon raqam</th>
                <th>Ro'yxatdan o'tish soni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(participant, index) in topParticipants" :key="participant.phone">
                <td>{{ index + 1 }}</td>
                <td>{{ participant.name }}</td>
                <td>{{ participant.phone }}</td>
                <td class="highlight">{{ participant.registrations }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Oxirgi 10 ta ro'yxatdan o'tgan ishtirokchilar</h2>
            <p class="panel__subtitle">Oxirgi kelib tushgan arizalar ro'yxati.</p>
          </div>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ism</th>
                <th>Telefon raqam</th>
                <th>Ro'yxatdan o'tgan vaqt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(participant, index) in latestParticipants" :key="participant.phone">
                <td>{{ index + 1 }}</td>
                <td>{{ participant.name }}</td>
                <td>{{ participant.phone }}</td>
                <td>{{ participant.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  </ServiceLayout>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.panel {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 16px;
}

.panel__header h2 {
  font-size: 18px;
  color: #0f172a;
}

.panel__subtitle {
  color: #64748b;
  font-size: 14px;
  margin-top: 4px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
 td {
  text-align: left;
  padding: 10px 12px;
}

th {
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
}

tbody tr {
  border-bottom: 1px solid #e2e8f0;
}

.highlight {
  font-weight: 700;
  color: #4f46e5;
}

.ghost-button {
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.ghost-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12);
}
</style>
