import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:country_code/:city',
      name: 'location',
      component: HomeView
    },
    // Catch-all route to redirect to home page
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
    }
    // TODO: add error page
  ]
})

export default router
