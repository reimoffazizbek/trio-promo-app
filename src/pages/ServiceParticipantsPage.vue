<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { participantService } from '../services/participantService'
import ServiceLayout from '../components/ServiceLayout.vue'
import type { ParticipantItem } from '../types/api'
import {formatDate} from "../services/GlobalVar.ts";

const router = useRouter()

const participants = ref<ParticipantItem[]>([])
const totalRegistrations = ref(0)
const participantCount = ref(0)
const totalPages = ref(1)
const totalElements = ref(0)
const pageSize = 10
const currentPage = ref(1)
const searchTerm = ref('')
const isLoading = ref(false)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const fetchStats = async () => {
  const response = await participantService.getStats()
  totalRegistrations.value = response.data.totalRegistration
  participantCount.value = response.data.totalParticipant
}

const fetchParticipants = async () => {
  isLoading.value = true
  try {
    const response = await participantService.findAll({
      page: currentPage.value - 1,
      size: pageSize,
      search: searchTerm.value.trim() || undefined,
    })
    participants.value = response.data.content
    totalPages.value = Math.max(response.data.totalPages, 1)
    totalElements.value = response.data.totalElements
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page: number) => {
  const nextPage = Math.min(Math.max(page, 1), totalPages.value)
  currentPage.value = nextPage
}

const handleLogout = async () => {
  authService.clearSession()
  await router.push('/service/login')
}

watch(currentPage, () => {
  void fetchParticipants()
})

watch(searchTerm, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    void fetchParticipants()
  }, 1200)
})

onMounted(() => {
  void fetchStats()
  void fetchParticipants()
})

onBeforeUnmount(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<template>
  <ServiceLayout
    eyebrow="Ishtirokchilar"
    title="Ishtirokchilar ro'yxati"
    subtitle="Umumiy ro'yxat va promokodlar bilan bog'langan ishtirokchilar ma'lumotlari."
  >
    <template #actions>
      <button class="ghost-button" type="button" @click="handleLogout">Chiqish</button>
    </template>

    <section class="stats-grid">
      <article class="stat-card">
        <p class="stat-card__label">Umumiy ro'yxatdan o'tishlar soni</p>
        <h2>{{ totalRegistrations }}</h2>
        <p class="stat-card__hint">Barcha qaydlar yig'indisi.</p>
      </article>
      <article class="stat-card">
        <p class="stat-card__label">Ishtirokchilar soni</p>
        <h2>{{ participantCount }}</h2>
        <p class="stat-card__hint">Hozirgi ro'yxatdagi ishtirokchilar.</p>
      </article>
    </section>

    <section class="panel">
      <div class="panel__header">
        <div>
          <h2>Ishtirokchilar jadvali</h2>
          <p class="panel__subtitle">Promokod bilan ro'yxatdan o'tganlar ro'yxati.</p>
        </div>
        <div class="panel__actions">
          <input v-model="searchTerm" class="search-input" type="search" placeholder="Ishtirokchi qidiring..." />
          <span class="badge">Jami: {{ totalElements }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Telefon raqam</th>
              <th>Promokod</th>
              <th>Ro'yxatdan o'tgan vaqt</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="4">Ma'lumotlar yuklanmoqda...</td>
            </tr>
            <tr v-else-if="participants.length === 0">
              <td colspan="4">Ishtirokchilar topilmadi.</td>
            </tr>
            <template v-else>
              <tr v-for="(participant, index) in participants" :key="participant.id">
                <td>{{ totalElements - ((currentPage - 1) * pageSize + index) }}</td>
                <td>{{ participant.fullName }}</td>
                <td>{{ participant.phoneNumber }}</td>
                <td class="code">{{ participant.promoCode }}</td>
                <td>{{ formatDate(participant.createdAt) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="pagination__button" type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          Oldingi
        </button>
        <div class="pagination__info">
          <span>Sahifa {{ currentPage }} / {{ totalPages }}</span>
        </div>
        <button
          class="pagination__button"
          type="button"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Keyingi
        </button>
      </div>
    </section>
  </ServiceLayout>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.stat-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
  display: grid;
  gap: 8px;
}

.stat-card__label {
  font-size: 13px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-card h2 {
  font-size: 28px;
  color: #0f172a;
}

.stat-card__hint {
  color: #94a3b8;
  font-size: 14px;
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

.panel__header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.panel__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 14px;
  min-width: 220px;
}

.badge {
  background: #eef2ff;
  color: #4338ca;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
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

.code {
  font-weight: 600;
  color: #4338ca;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.pagination__button {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}

.pagination__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__info {
  color: #475569;
  font-weight: 600;
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
