import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from '../pages/RegistrationPage.vue'
import DiscountsPage from '../pages/DiscountsPage.vue'

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
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
