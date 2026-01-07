import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginModal from '@/components/UserLoginModal.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import HistoryPage from '@/pages/HistoryPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginModal,
    },
    {
      path: '/favorites',
      name: '收藏夹',
      component: FavoritesPage,
    },
    {
      path: '/history',
      name: '浏览历史',
      component: HistoryPage,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
