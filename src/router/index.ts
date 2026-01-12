import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginModal from '@/components/UserLoginModal.vue'
import FavoritesPage from '@/pages/FavoritesPage.vue'
import HistoryPage from '@/pages/HistoryPage.vue'
import UserInfoPage from '@/pages/user/UserInfoPage.vue'
import FeedPage from '@/pages/FeedPage.vue'
import UserAttnPage from '@/pages/user/UserAttnPage.vue'
import UserMessagePage from '@/pages/user/UserMessagePage.vue'

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
      path: '/user/info',
      name: '用户资料',
      component: UserInfoPage,
    },
    {
      path: '/user/message',
      name: '用户信息',
      component: UserMessagePage,
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
      path: '/feed',
      name: '用户动态',
      component: FeedPage,
    },
    {
      path: '/attn',
      name: '用户关注',
      component: UserAttnPage,
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
