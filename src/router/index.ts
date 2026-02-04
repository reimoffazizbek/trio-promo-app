import { createRouter, createWebHistory } from 'vue-router'
import RegistrationPage from '../pages/RegistrationPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'registration',
      component: RegistrationPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
