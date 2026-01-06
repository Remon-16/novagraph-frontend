<template>
  <div class="header-content">
    <!-- Logo区域 -->
    <div class="logo" @click="$router.push('/')">
      <CameraOutlined />
      <span class="logo-text">NovaGraph</span>
    </div>

    <!-- 主导航 -->
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      class="nav-menu"
      :items="navItems"
      @click="handleMenuClick"
    />

    <!-- 用户操作区域 -->
    <div class="user-actions">
      <!-- 搜索框 -->
      <a-input-search
        v-model:value="searchValue"
        placeholder="搜索故事..."
        class="search-input"
        @search="handleSearch"
      />

      <!-- 未登录状态 -->
      <template v-if="!userStore.isLoggedIn">
        <a-button type="text" @click="handleLogin">
          登录
        </a-button>
        <a-button type="primary" @click="handleRegister">
          注册
        </a-button>
      </template>

      <!-- 已登录状态 -->
      <template v-else>
        <!-- 动态中心 -->
        <div>
          <div v-if="unReadMessage" class="badge-dot"></div>
          <MessageOutlined class="message-icon" />
        </div>
        <!-- 历史列表 -->
        <div>
          <div v-if="unReadMessage" class="badge-dot"></div>
          <HistoryOutlined class="message-icon" />
        </div>
        <!-- 收藏夹 -->
        <div>
          <div v-if="unReadMessage" class="badge-dot"></div>
          <StarOutlined class="message-icon" />
        </div>
        <!-- 消息中心 -->
        <div>
          <div v-if="unReadMessage" class="badge-dot"></div>
          <MailOutlined class="message-icon" />
        </div>
        <!-- 创作中心 -->
        <a-button
          type="primary"
          @click="handleUpload"
          class="upload-btn"
        >
          <template #icon>
            <AlertOutlined />
          </template>
          创作中心
        </a-button>

        <div v-if="loginUserStore.loginUser.id">
          <!-- 用户信息栏 -->
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <div class="user-avatar">
              <a-avatar :size="32" :src="userStore.userInfo?.avatar">
                {{ userStore.userInfo?.nickname?.charAt(0) }}
              </a-avatar>
              <span class="username">{{ userStore.userInfo?.nickname }}</span>
              <DownOutlined class="dropdown-icon" />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="handleProfile">
                  <UserOutlined />
                  我的空间
                </a-menu-item>
                <a-menu-item key="my-images" @click="handleMyImages">
                  <FormOutlined />
                  个人资料
                </a-menu-item>
                <a-menu-item key="favorites" @click="handleFavorites">
                  <ShoppingOutlined />
                  积分商城
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-else>
          <!-- 登录注册模态框 -->
          <UserLoginModal
            v-model:open="showAuthModal"
            @login-success="handleLoginSuccess"
          />
          <a-button type="primary" @click="showAuthModal = true">
            <template #icon>
              <UserOutlined />
            </template>
            登录 / 注册
          </a-button>
        </div>


      </template>
    </div>
  </div>
</template>

<script setup lang="ts">

import {
  CameraOutlined,
  DownOutlined,
  ShoppingOutlined, LogoutOutlined, FormOutlined,
  MailOutlined,
  HistoryOutlined,
  StarOutlined,
  AlertOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { computed, h, ref } from 'vue'
import { type MenuProps, message } from 'ant-design-vue'
import UserLoginModal from '@/components/UserLoginModal.vue'

// 路由
const router = useRouter()
const route = useRoute()

const loginUserStore = useLoginUserStore()

// 控制模态框显示/隐藏
const showAuthModal = ref(false)
const unReadMessage = ref(false)

// 登录成功回调
const handleLoginSuccess = () => {
  showAuthModal.value = false
  // 可以在这里刷新用户信息等操作
}

// 用户状态管理（模拟）
const userStore = {
  isLoggedIn: ref(false),
  userInfo: ref({
    nickname: '用户昵称',
    avatar: ''
  })
}


// 响应式数据
const selectedKeys = ref<string[]>(['home'])
const searchValue = ref('')

// 导航菜单项
const navItems = ref([
  {
    key: 'home',
    label: '首页',
    icon: () => h(CameraOutlined)
  },
  {
    key: 'explore',
    label: '发现',
    icon: () => h('span', '🔍')
  },
  {
    key: 'categories',
    label: '分类',
    icon: () => h('span', '📁'),
    children: [
      { key: 'nature', label: '自然风光' },
      { key: 'portrait', label: '人像摄影' },
      { key: 'architecture', label: '建筑艺术' },
      { key: 'abstract', label: '抽象艺术' },
      { key: 'ai-generated', label: 'AI生成' }
    ]
  },
  {
    key: 'collections',
    label: '精选集',
    icon: () => h('span', '⭐')
  }
])

// 计算属性
const currentRouteKey = computed(() => {
  const path = route.path
  if (path === '/') return ['home']
  if (path === '/explore') return ['explore']
  if (path.startsWith('/category')) return ['categories']
  if (path.startsWith('/collection')) return ['collections']
  return ['home']
})

// 方法
const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  switch (key) {
    case 'home':
      router.push('/')
      break
    case 'explore':
      router.push('/explore')
      break
    case 'nature':
    case 'portrait':
    case 'architecture':
    case 'abstract':
    case 'ai-generated':
      router.push(`/category/${key}`)
      break
    case 'collections':
      router.push('/collections')
      break
  }
}

const handleSearch = (value: string) => {
  if (value.trim()) {
    router.push(`/search?q=${encodeURIComponent(value)}`)
  }
}

const handleLogin = () => {
  router.push('/auth?type=login')
}

const handleRegister = () => {
  router.push('/auth?type=register')
}

const handleUpload = () => {
  if (!userStore.isLoggedIn.value) {
    message.warning('请先登录后再上传图片')
    return
  }
  // 打开上传对话框
  message.info('打开上传对话框')
}

const handleAIDraw = () => {
  if (!userStore.isLoggedIn.value) {
    message.warning('请先登录后再使用AI绘图')
    return
  }
  router.push('/ai-draw')
}

const handleProfile = () => {
  router.push('/profile')
}

const handleMyImages = () => {
  router.push('/my-images')
}

const handleFavorites = () => {
  router.push('/favorites')
}

const handleLogout = () => {
  userStore.isLoggedIn.value = false
  message.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
  margin-right: 40px;
}

.logo-text {
  margin-left: 8px;
}

.nav-menu {
  flex: 1;
  border-bottom: none;
  background: transparent;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.search-input {
  width: 240px;
}

.upload-btn, .ai-draw-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: #f5f5f5;
}

.username {
  font-weight: 500;
  color: #262626;
}

.dropdown-icon {
  font-size: 12px;
  color: #8c8c8c;
}

.badge-dot {
  position: absolute;
  top: -5px;
  right: 0px;
  width: 12px;
  height: 12px;
  background: #f5222d;
  border-radius: 50%;
  border: 2px solid white;
  z-index: 1;
}
.message-icon {
  display: flex;
  margin-right: 12px;
  margin-top: 2px;
  font-size: 22px; /* 调整大小 */
  color: rgba(0, 0, 0, 0.45); /* 调整颜色，使用灰色 */
}

</style>
