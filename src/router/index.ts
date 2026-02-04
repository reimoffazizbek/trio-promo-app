import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from '../pages/RegistrationPage.vue'
import DiscountsPage from '../pages/DiscountsPage.vue'
import ServiceLoginPage from '../pages/ServiceLoginPage.vue'
import ServiceDashboardPage from '../pages/ServiceDashboardPage.vue'
import ServicePromocodesPage from '../pages/ServicePromocodesPage.vue'
import ServiceParticipantsPage from '../pages/ServiceParticipantsPage.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'registration',
      component: RegistrationPage,
    },
    {
      path: '/discounts',
      name: 'discounts',
      component: DiscountsPage,
    },
    {
      path: '/service/login',
      name: 'service-login',
      component: ServiceLoginPage,
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: '/service/dashboard',
      name: 'service-dashboard',
      component: ServiceDashboardPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/service/promocodes',
      name: 'service-promocodes',
      component: ServicePromocodesPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/service/participants',
      name: 'service-participants',
      component: ServiceParticipantsPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/service',
      redirect: '/service/login',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = Boolean(authStore.accessToken)

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      path: '/service/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return {
      path: '/service/dashboard',
    }
  }

  return true
})

export default router
