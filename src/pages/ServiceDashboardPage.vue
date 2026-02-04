<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { participantService } from '../services/participantService'
import { useAuthStore } from '../stores/auth'
import ServiceLayout from '../components/ServiceLayout.vue'
import type { ParticipantItem, TopParticipant } from '../types/api'
import {formatDate} from "../services/GlobalVar.ts";

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => {
  const user = authStore.authResponse?.data?.user
  if (!user) {
    return 'Admin'
  }
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.phoneNumber || 'Admin'
})

const topParticipants = ref<TopParticipant[]>([])
const latestParticipants = ref<ParticipantItem[]>([])

const fetchTopParticipants = async () => {
  const response = await participantService.findTopParticipants()
  topParticipants.value = response.data
}

const fetchLatestParticipants = async () => {
  const response = await participantService.findAll({
    page: 0,
    size: 10,
    search: null,
  })
  latestParticipants.value = response.data.content
}

const getDescendingIndex = (total: number, index: number) => total - index

const handleLogout = async () => {
  authService.clearSession()
  await router.push('/service/login')
}

onMounted(() => {
  void fetchTopParticipants()
  void fetchLatestParticipants()
})
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
              <tr v-for="(participant, index) in topParticipants" :key="participant.id">
                <td>{{ getDescendingIndex(topParticipants.length, index) }}</td>
                <td>{{ participant.fullName }}</td>
                <td>{{ participant.phoneNumber }}</td>
                <td class="highlight">{{ participant.totalRegistrationCount }}</td>
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
              <tr v-for="(participant, index) in latestParticipants" :key="participant.id">
                <td>{{ getDescendingIndex(latestParticipants.length, index) }}</td>
                <td>{{ participant.fullName }}</td>
                <td>{{ participant.phoneNumber }}</td>
                <td>{{ formatDate(participant.createdAt) || formatDate(participant.createdDate) || '-' }}</td>
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
  height: min-content;
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
