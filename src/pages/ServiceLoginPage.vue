<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminAuthService } from '../services/adminAuthService'
import { authService } from '../services/authService'
import { getApiErrorMessage } from '../services/GlobalVar'

const PHONE_PREFIX = '+998 '

const route = useRoute()
const router = useRouter()

const formState = ref({
  phone: PHONE_PREFIX,
  password: '',
})

const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref<'idle' | 'error'>('idle')

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

const countDigitsBefore = (value: string, position: number) => {
  let count = 0
  for (let i = 0; i < position; i += 1) {
    if (/\d/.test(value[i] || "")) {
      count += 1
    }
  }
  return count
}

const getLocalDigits = (value: string) => {
  let digits = value.replace(/\D/g, '')

  if (digits.startsWith('998')) {
    digits = digits.slice(3)
  }

  return digits
}

const getCaretPositionForLocalIndex = (value: string, localIndex: number) => {
  if (localIndex <= 0) {
    return PHONE_PREFIX.length
  }

  const targetDigitCount = 3 + localIndex
  let count = 0

  for (let i = 0; i < value.length; i += 1) {
    if (/\d/.test(value[i] || "")) {
      count += 1
      if (count === targetDigitCount) {
        return i + 1
      }
    }
  }

  return value.length
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

  if (selectionStart !== selectionEnd || (event.key !== 'Backspace' && event.key !== 'Delete')) {
    return
  }

  const value = input.value
  const isBackspace = event.key === 'Backspace'
  const charBefore = value[selectionStart - 1]
  const charAfter = value[selectionStart]
  const isFormattingChar = (char?: string) => Boolean(char && /\D/.test(char))

  if ((isBackspace && isFormattingChar(charBefore)) || (!isBackspace && isFormattingChar(charAfter))) {
    event.preventDefault()

    const localDigits = getLocalDigits(value).split('')
    const digitsBeforeCursor = Math.max(0, countDigitsBefore(value, selectionStart) - 3)
    const removeIndex = isBackspace ? digitsBeforeCursor - 1 : digitsBeforeCursor

    if (removeIndex >= 0 && removeIndex < localDigits.length) {
      localDigits.splice(removeIndex, 1)
    }

    const formatted = normalizePhone(localDigits.join(''))
    formState.value.phone = formatted
    input.value = formatted

    const caretIndex = getCaretPositionForLocalIndex(formatted, Math.max(removeIndex, 0))
    input.setSelectionRange(caretIndex, caretIndex)
  }
}

const isFormValid = computed(() => {
  const digitCount = formState.value.phone.replace(/\D/g, '').length
  return digitCount === 12 && formState.value.password.trim().length >= 4
})

const resetStatus = () => {
  statusMessage.value = ''
  statusType.value = 'idle'
}

const handleSubmit = async () => {
  resetStatus()

  if (!isFormValid.value) {
    statusType.value = 'error'
    statusMessage.value = "Telefon raqam va parolni to'liq kiriting."
    return
  }

  isSubmitting.value = true

  try {
    const response = await adminAuthService.login({
      phoneNumber: formState.value.phone.trim().replace(/[()\s-]/g, ''),
      password: formState.value.password.trim(),
    })

    authService.setSession(response)
    const redirectTarget = (route.query.redirect as string) ?? '/service/dashboard'
    await router.push(redirectTarget)
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
        <div>
          <h1>Admin panelga kirish</h1>
          <p class="subtitle">Xizmat bo'limiga kirish uchun telefon raqam va parolingizni kiriting.</p>
        </div>
      </header>

      <form class="form" @submit.prevent="handleSubmit">
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
          <span>Parol</span>
          <input v-model="formState.password" type="password" placeholder="Parol" autocomplete="current-password" />
        </label>

        <button class="button" type="submit" :disabled="isSubmitting">
          <span v-if="isSubmitting">Kirish...</span>
          <span v-else>Admin panelga kirish</span>
        </button>
      </form>

      <p v-if="statusMessage" class="status status--error">
        {{ statusMessage }}
      </p>
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
  width: min(460px, 100%);
  background: rgba(255, 255, 255, 0.94);
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 30px 80px rgba(79, 70, 229, 0.18);
  display: grid;
  gap: 24px;
  border: 1px solid rgba(79, 70, 229, 0.12);
  backdrop-filter: blur(12px);
}

.card__header {
  display: grid;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

h1 {
  font-size: 24px;
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

.status--error {
  background: #fef2f2;
  color: #b42318;
}
</style>
