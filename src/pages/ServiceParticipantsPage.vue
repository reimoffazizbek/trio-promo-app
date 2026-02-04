<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import ServiceLayout from '../components/ServiceLayout.vue'

const router = useRouter()

const participants = [
  { name: 'Aziza Karimova', phone: '+998 90 123 45 67', promoCode: 'TRIO001', registrations: 2 },
  { name: 'Kamron Raxmonov', phone: '+998 91 234 56 78', promoCode: 'TRIO014', registrations: 1 },
  { name: 'Madina Nematova', phone: '+998 93 345 67 89', promoCode: 'TRIO027', registrations: 3 },
  { name: 'Shohruh Xasanov', phone: '+998 94 456 78 90', promoCode: 'TRIO042', registrations: 1 },
  { name: 'Nargiza Usmonova', phone: '+998 95 567 89 01', promoCode: 'TRIO050', registrations: 2 },
  { name: 'Farruh Qodirov', phone: '+998 90 678 90 12', promoCode: 'TRIO061', registrations: 1 },
  { name: 'Lola Otabekova', phone: '+998 91 789 01 23', promoCode: 'TRIO073', registrations: 4 },
  { name: 'Sardor Ismoilov', phone: '+998 93 890 12 34', promoCode: 'TRIO085', registrations: 2 },
  { name: 'Dilnoza Muminova', phone: '+998 94 901 23 45', promoCode: 'TRIO092', registrations: 1 },
  { name: 'Javohir Toirov', phone: '+998 95 112 23 34', promoCode: 'TRIO099', registrations: 2 },
  { name: 'Feruza Ibragimova', phone: '+998 90 223 34 45', promoCode: 'TRIO108', registrations: 1 },
  { name: 'Bekzod Eshonov', phone: '+998 91 334 45 56', promoCode: 'TRIO115', registrations: 3 },
]

const totalRegistrations = computed(() =>
  participants.reduce((total, participant) => total + participant.registrations, 0),
)

const participantCount = computed(() => participants.length)

const handleLogout = async () => {
  authService.clearSession()
  await router.push('/service/login')
}
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
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Telefon raqam</th>
              <th>Promokod</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in participants" :key="participant.phone">
              <td>{{ index + 1 }}</td>
              <td>{{ participant.name }}</td>
              <td>{{ participant.phone }}</td>
              <td class="code">{{ participant.promoCode }}</td>
            </tr>
          </tbody>
        </table>
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
