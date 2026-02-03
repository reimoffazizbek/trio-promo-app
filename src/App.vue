<script setup lang="ts">
import { computed, ref } from 'vue'

const formState = ref({
  firstName: '',
  lastName: '',
  phone: '',
  promoCode: '',
})

const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref<'idle' | 'success' | 'error'>('idle')

const isFormValid = computed(() => {
  const { firstName, lastName, phone, promoCode } = formState.value
  return (
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    phone.trim().length >= 7 &&
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

  const endpoint = import.meta.env.VITE_SHEETS_WEBAPP_URL as string | undefined

  if (!endpoint) {
    statusType.value = 'error'
    statusMessage.value =
      'Google Sheets uchun server manzili sozlanmagan. VITE_SHEETS_WEBAPP_URL ni kiriting.'
    return
  }

  isSubmitting.value = true

  const payload = {
    firstName: formState.value.firstName.trim(),
    lastName: formState.value.lastName.trim(),
    phone: formState.value.phone.trim(),
    promoCode: formState.value.promoCode.trim(),
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      redirect: "follow",
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    }).then((res) => res.json())

    if (!response.success) {
      statusType.value = 'error'
      statusMessage.value =
        response?.message ?? "Promocode topilmadi yoki avval ishlatilgan. Qayta tekshirib ko'ring."
      return
    }

    statusType.value = 'success'
    statusMessage.value =
      "Tabriklaymiz! Ro'yxatdan muvaffaqiyatli o'tdingiz."
    formState.value = {
      firstName: '',
      lastName: '',
      phone: '',
      promoCode: '',
    }
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = "Server bilan bog'lanishda xatolik yuz berdi. Keyinroq urinib ko'ring."
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <main class="card">
      <header class="card__header">
        <p class="eyebrow">Trio Promo</p>
        <h1>Aktsiyada ishtirok eting</h1>
        <p class="subtitle">
          Promocode kiriting va ishtirokchi bo'ling. Ma'lumotlaringiz Google Sheets bazasida saqlanadi.
        </p>
      </header>

      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>Ism</span>
          <input v-model="formState.firstName" type="text" placeholder="Ismingiz" autocomplete="given-name" />
        </label>

        <label class="field">
          <span>Familiya</span>
          <input v-model="formState.lastName" type="text" placeholder="Familiyangiz" autocomplete="family-name" />
        </label>

        <label class="field">
          <span>Telefon raqam</span>
          <input v-model="formState.phone" type="tel" placeholder="+998 90 123 45 67" autocomplete="tel" />
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

      <div class="tips">
        <p>
          Promocodelar faqat bir marta ishlatiladi. Agar promocode ishlamasa, u avval aktiv bo'lmagan
          bo'lishi mumkin.
        </p>
        <p>Server manzilini sozlash uchun <code>.env</code> faylida VITE_SHEETS_WEBAPP_URL ni kiriting.</p>
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
  padding: 32px 16px;
}

.card {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 24px;
}

.card__header {
  display: grid;
  gap: 12px;
}

.eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #64748b;
  font-weight: 600;
}

.subtitle {
  color: #475569;
  line-height: 1.6;
}

.form {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
  font-weight: 600;
  color: #0f172a;
}

.field input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 15px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.button {
  padding: 14px 16px;
  border-radius: 12px;
  border: none;
  background: #4f46e5;
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
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.3);
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

.tips {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  display: grid;
  gap: 8px;
}

.tips code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}
</style>
