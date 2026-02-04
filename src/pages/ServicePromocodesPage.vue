<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import ServiceLayout from '../components/ServiceLayout.vue'

const router = useRouter()

const promoCodes = Array.from({ length: 132 }, (_, index) => {
  const codeNumber = String(index + 1).padStart(3, '0')
  return {
    code: `TRIO${codeNumber}`,
    used: index % 3 === 0,
  }
})

const pageSize = 100
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(promoCodes.length / pageSize))

const paginatedCodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return promoCodes.slice(start, start + pageSize)
})

const activeCount = computed(() => promoCodes.filter((code) => !code.used).length)
const usedCount = computed(() => promoCodes.filter((code) => code.used).length)

const goToPage = (page: number) => {
  const nextPage = Math.min(Math.max(page, 1), totalPages.value)
  currentPage.value = nextPage
}

const handleLogout = async () => {
  authService.clearSession()
  await router.push('/service/login')
}
</script>

<template>
  <ServiceLayout
    eyebrow="Promokodlar"
    title="Promokodlar ro'yxati"
    subtitle="Promokodlar holati va ishlatilganlik ko'rsatkichlarini kuzating."
  >
    <template #actions>
      <button class="ghost-button" type="button" @click="handleLogout">Chiqish</button>
    </template>

    <section class="stats-grid">
      <article class="stat-card">
        <p class="stat-card__label">Active promo kodlar soni</p>
        <h2>{{ activeCount }}</h2>
        <p class="stat-card__hint">Hali ishlatilmagan promokodlar.</p>
      </article>
      <article class="stat-card">
        <p class="stat-card__label">Ishlatilgan promo kodlar soni</p>
        <h2>{{ usedCount }}</h2>
        <p class="stat-card__hint">Aktivatsiya qilingan promokodlar.</p>
      </article>
    </section>

    <section class="panel">
      <div class="panel__header">
        <div>
          <h2>Promokodlar jadvali</h2>
          <p class="panel__subtitle">Sahifa o'lchami: {{ pageSize }}</p>
        </div>
        <div class="panel__actions">
          <span class="badge">Jami: {{ promoCodes.length }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Promokod</th>
              <th>Ishlatilganmi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(promo, index) in paginatedCodes" :key="promo.code">
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="code">{{ promo.code }}</td>
              <td>
                <span class="status" :class="promo.used ? 'status--used' : 'status--active'">
                  {{ promo.used ? "Ha" : "Yo'q" }}
                </span>
              </td>
            </tr>
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

.panel__header {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
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

.badge {
  background: #eef2ff;
  color: #4338ca;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
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
}

.status {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status--active {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.status--used {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
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
