<script setup lang="ts">
import { computed, ref } from 'vue'
import { promoService } from '../services/promoService'
import { getApiErrorMessage } from '../services/GlobalVar'
import type { PromoRegistrationPayload } from '../types/api'

const PHONE_PREFIX = '+998 '

const createFormState = () => ({
  firstName: '',
  phone: PHONE_PREFIX,
  promoCode: '',
})

const formState = ref(createFormState())

const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref<'idle' | 'success' | 'error'>('idle')

const normalizePhone = (value: string) => {
  let digits = value.replace(/\D/g, '')

  if (digits.startsWith('998')) {
    digits = digits.slice(3)
  }

  const local = digits.slice(0, 9)
  const part1 = local.slice(0, 2)
  const part2 = local.slice(2, 5)
  const part3 = local.slice(5, 7)
  const part4 = local.slice(7, 9)

  let formatted = PHONE_PREFIX

  if (part1) {
    formatted += `(${part1}`
  }

  if (part1.length === 2) {
    formatted += ')'
  }

  if (part2) {
    formatted += ` ${part2}`
  }

  if (part3) {
    formatted += ` ${part3}`
  }

  if (part4) {
    formatted += ` ${part4}`
  }

  return formatted.trimEnd()
}

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const formatted = normalizePhone(input.value)
  formState.value.phone = formatted

  if (input.value !== formatted) {
    input.value = formatted
  }
}

const handlePhoneKeydown = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const selectionStart = input.selectionStart ?? 0
  const selectionEnd = input.selectionEnd ?? 0

  if (
    (event.key === 'Backspace' && selectionStart <= PHONE_PREFIX.length && selectionEnd <= PHONE_PREFIX.length) ||
    (event.key === 'Delete' && selectionStart < PHONE_PREFIX.length)
  ) {
    event.preventDefault()
    input.setSelectionRange(PHONE_PREFIX.length, PHONE_PREFIX.length)
  }
}

const isFormValid = computed(() => {
  const { firstName, phone, promoCode } = formState.value
  const digitCount = phone.replace(/\D/g, '').length
  return (
    firstName.trim().length > 0 &&
    digitCount === 12 &&
    promoCode.trim().length === 6
  )
})

const resetStatus = () => {
  statusMessage.value = ''
  statusType.value = 'idle'
}

const handleSubmit = async () => {
  resetStatus()

  if (!isFormValid.value) {
    statusType.value = 'error'
    statusMessage.value =
      "Iltimos, barcha maydonlarni to'g'ri to'ldiring. Promocode 6 ta belgidan iborat bo'lishi kerak."
    return
  }

  isSubmitting.value = true

  const payload: PromoRegistrationPayload = {
    fullName: formState.value.firstName.trim(),
    phone: formState.value.phone.trim().replace(/[()\s-]/g, ''),
    promoCode: formState.value.promoCode.trim(),
  }

  try {
    const response = await promoService.registerPromo(payload)

    statusType.value = 'success'
    statusMessage.value = response.message ?? "Tabriklaymiz! So'rovingiz qabul qilindi."
    formState.value.promoCode = ''
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = getApiErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <main class="card">
      <header class="card__header">
        <img class="logo" src="/logo.svg" alt="Trio Promo" />
        <div class="header-text">
          <h1>Aktsiyada ishtirok eting</h1>
          <p class="subtitle">
            Promocodeni kiriting va sovg'alar uchun ro'yxatdan o'ting. Ma'lumotlaringiz xavfsiz saqlanadi.
          </p>
        </div>
      </header>

      <section class="promo-link">
        <div>
          <h2>Aktsiyadagi mahsulotlarni ko'ring</h2>
          <p>Chegirmadagi mahsulotlar, foizlar va amal qilish muddatlari bilan tanishing.</p>
        </div>
        <router-link class="promo-link__button" to="/discounts">
          Aktsiyalar sahifasi
        </router-link>
      </section>

      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>Ism</span>
          <input v-model="formState.firstName" type="text" placeholder="Ismingiz" autocomplete="given-name" />
        </label>

        <label class="field">
          <span>Telefon raqam</span>
          <input
            v-model="formState.phone"
            type="tel"
            inputmode="numeric"
            placeholder="+998 (90) 123 45 67"
            autocomplete="tel"
            @input="handlePhoneInput"
            @keydown="handlePhoneKeydown"
          />
        </label>

        <label class="field">
          <span>Promocode</span>
          <input
            v-model="formState.promoCode"
            type="text"
            placeholder="6 ta belgidan iborat"
            maxlength="6"
            autocapitalize="characters"
          />
        </label>

        <button class="button" type="submit" :disabled="isSubmitting">
          <span v-if="isSubmitting">Yuborilmoqda...</span>
          <span v-else>Ro'yxatdan o'tish</span>
        </button>
      </form>

      <p v-if="statusMessage" class="status" :class="`status--${statusType}`">
        {{ statusMessage }}
      </p>

      <div class="contact">
        <h2>Biz bilan bog'laning</h2>
        <p>Savol yoki xatolik bo'lsa, tezkor yordam uchun yozing.</p>
        <div class="contact__items">
          <a class="contact__item" href="https://t.me/reimoffazizbek" target="_blank" rel="noopener">@reimoffazizbek</a>
          <a class="contact__item" href="tel:+998904217300">+998 90 421 73 00</a>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

.card {
  width: min(560px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 32px 80px rgba(79, 70, 229, 0.18);
  display: grid;
  gap: 24px;
  border: 1px solid rgba(79, 70, 229, 0.12);
  backdrop-filter: blur(12px);
}

.card__header {
  display: grid;
  gap: 18px;
}

.logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.header-text {
  display: grid;
  gap: 10px;
}

h1 {
  font-size: 28px;
  color: #111827;
}

.subtitle {
  color: #4b5563;
  line-height: 1.6;
}

.form {
  display: grid;
  gap: 16px;
}

.promo-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(129, 140, 248, 0.15));
  border: 1px solid rgba(79, 70, 229, 0.18);
}

.promo-link h2 {
  font-size: 18px;
  color: #1e1b4b;
}

.promo-link p {
  margin-top: 6px;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
}

.promo-link__button {
  padding: 10px 16px;
  border-radius: 999px;
  background: #ffffff;
  color: #4338ca;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid rgba(79, 70, 229, 0.3);
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.promo-link__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.2);
}

.field {
  display: grid;
  gap: 8px;
  font-weight: 600;
  color: #0f172a;
}

.field input {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  font-size: 15px;
  background: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  background: #ffffff;
}

.button {
  padding: 14px 16px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(79, 70, 229, 0.28);
}

.status {
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 600;
}

.status--success {
  background: #ecfdf3;
  color: #067647;
}

.status--error {
  background: #fef2f2;
  color: #b42318;
}

.contact {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.contact h2 {
  font-size: 16px;
  color: #111827;
}

.contact p {
  font-size: 14px;
  color: #64748b;
}

.contact__items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.contact__item {
  padding: 8px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
}

.contact__item:hover {
  background: #e0e7ff;
}

@media (max-width: 520px) {
  .card {
    padding: 28px 22px;
  }

  .promo-link {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo {
    width: 64px;
    height: 64px;
  }

  h1 {
    font-size: 24px;
  }
}
</style>
