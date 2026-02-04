<script setup lang="ts">
import { ref } from 'vue'

const products = [
  {
    id: 1,
    name: 'Coca-Cola 1.5L',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80',
    originalPrice: 18500,
    discountPercent: 20,
    discountedPrice: 14800,
    validUntil: '30-sentabr',
  },
  {
    id: 2,
    name: 'Kungaboqar yog‘i 1L',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80',
    originalPrice: 42000,
    discountPercent: 15,
    discountedPrice: 35700,
    validUntil: '28-sentabr',
  },
  {
    id: 3,
    name: 'Guruch 5 kg',
    image: 'https://images.unsplash.com/photo-1518131672697-613becd4fab5?auto=format&fit=crop&w=900&q=80',
    originalPrice: 98000,
    discountPercent: 25,
    discountedPrice: 73500,
    validUntil: '18-sentabr',
  },
  {
    id: 4,
    name: 'Choy Assorti 200 g',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=900&q=80',
    originalPrice: 32000,
    discountPercent: 30,
    discountedPrice: 22400,
    validUntil: '5-oktabr',
  },
]

const carouselRef = ref<HTMLDivElement | null>(null)

const formatPrice = (value: number) => `${value.toLocaleString('uz-UZ')} so'm`

const scrollCarousel = (direction: 'prev' | 'next') => {
  const container = carouselRef.value
  if (!container) return

  const scrollAmount = container.clientWidth * 0.9
  container.scrollBy({
    left: direction === 'next' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div class="discounts">
    <header class="discounts__header">
      <div>
        <p class="eyebrow">Oziq-ovqat do'koni chegirmalari</p>
        <h1>Eng issiq oziq-ovqat chegirmalari</h1>
        <p class="subtitle">
          Kundalik xaridlar uchun maxsus chegirmalar. Har bir taklif cheklangan muddatda amal qiladi, shuning uchun
          shoshiling.
        </p>
      </div>
      <router-link class="back-button" to="/">
        Ro'yxatdan o'tish sahifasiga qaytish
      </router-link>
    </header>

    <section class="highlight">
      <div>
        <h2>Chegirma foizlari 15% dan 30% gacha</h2>
        <p>
          Bu oddiy chegirma takliflari — promokod talab qilinmaydi. Hozircha statik ma'lumotlar asosida.
        </p>
      </div>
      <div class="highlight__stat">
        <span class="stat-label">Faol aktsiyalar</span>
        <span class="stat-value">4 ta mahsulot</span>
      </div>
    </section>

    <section class="carousel">
      <div class="carousel__header">
        <h2>Chegirmadagi mahsulotlar</h2>
        <div class="carousel__controls">
          <button class="carousel__button" type="button" @click="scrollCarousel('prev')">
            ⟵ Oldingi
          </button>
          <button class="carousel__button" type="button" @click="scrollCarousel('next')">
            Keyingi ⟶
          </button>
        </div>
      </div>

      <div ref="carouselRef" class="carousel__track">
        <article v-for="product in products" :key="product.id" class="product-card">
          <div class="product-card__image">
            <img :src="product.image" :alt="product.name" loading="lazy" />
            <span class="badge">-{{ product.discountPercent }}%</span>
          </div>
          <div class="product-card__body">
            <h3>{{ product.name }}</h3>
            <p class="validity">Amal qilish muddati: {{ product.validUntil }}</p>
            <div class="prices">
              <span class="original">{{ formatPrice(product.originalPrice) }}</span>
              <span class="discounted">{{ formatPrice(product.discountedPrice) }}</span>
            </div>
            <div class="promo-callout">
              <span>Chegirma har bir xaridor uchun amal qiladi</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.discounts {
  min-height: 100vh;
  padding: 48px clamp(16px, 5vw, 64px) 72px;
  display: grid;
  gap: 32px;
}

.discounts__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: #4338ca;
  font-size: 12px;
}

h1 {
  font-size: clamp(28px, 3vw, 40px);
  color: #0f172a;
  margin-top: 8px;
}

.subtitle {
  max-width: 520px;
  color: #475569;
  margin-top: 12px;
  line-height: 1.6;
}

.back-button {
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  color: #4338ca;
  font-weight: 600;
  text-decoration: none;
  background: #eef2ff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.2);
}

.highlight {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(129, 140, 248, 0.2));
  border: 1px solid rgba(79, 70, 229, 0.15);
}

.highlight h2 {
  font-size: 22px;
  color: #1e1b4b;
}

.highlight p {
  color: #475569;
  margin-top: 8px;
  max-width: 520px;
}

.highlight__stat {
  padding: 18px 22px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.12);
  display: grid;
  gap: 6px;
  min-width: 180px;
}

.stat-label {
  color: #64748b;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #312e81;
}

.carousel {
  display: grid;
  gap: 20px;
}

.carousel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.carousel__header h2 {
  font-size: 22px;
  color: #111827;
}

.carousel__controls {
  display: flex;
  gap: 12px;
}

.carousel__button {
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(79, 70, 229, 0.3);
  background: #ffffff;
  color: #4338ca;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.carousel__button:hover {
  background: #4338ca;
  color: #ffffff;
  transform: translateY(-1px);
}

.carousel__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(240px, 320px);
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 12px;
  scroll-snap-type: x mandatory;
}

.carousel__track::-webkit-scrollbar {
  height: 8px;
}

.carousel__track::-webkit-scrollbar-track {
  background: rgba(79, 70, 229, 0.1);
  border-radius: 999px;
}

.carousel__track::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.4);
  border-radius: 999px;
}

.product-card {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.12);
  scroll-snap-align: start;
  display: grid;
  min-height: 420px;
}

.product-card__image {
  position: relative;
  height: 210px;
  overflow: hidden;
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #4f46e5;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 10px 18px rgba(79, 70, 229, 0.35);
}

.product-card__body {
  padding: 20px 22px 24px;
  display: grid;
  gap: 12px;
}

.product-card__body h3 {
  font-size: 18px;
  color: #0f172a;
}

.validity {
  font-size: 14px;
  color: #64748b;
}

.prices {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.original {
  text-decoration: line-through;
  color: #94a3b8;
  font-weight: 600;
}

.discounted {
  font-size: 22px;
  font-weight: 700;
  color: #1d4ed8;
}

.promo-callout {
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(79, 70, 229, 0.08);
  color: #4338ca;
  font-weight: 600;
  font-size: 13px;
}

@media (max-width: 640px) {
  .discounts__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .highlight {
    padding: 18px;
  }

  .carousel__controls {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
