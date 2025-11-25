<template>
  <a-layout class="basic-layout">
    <!-- 头部导航 -->
    <a-layout-header class="header">
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
            placeholder="搜索图片..."
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
            <!-- 上传按钮 -->
            <a-button
              type="primary"
              @click="handleUpload"
              class="upload-btn"
            >
              <template #icon>
                <UploadOutlined />
              </template>
              上传图片
            </a-button>

            <!-- AI绘图按钮 -->
            <a-button
              type="dashed"
              @click="handleAIDraw"
              class="ai-draw-btn"
            >
              <template #icon>
                <RobotOutlined />
              </template>
              AI绘图
            </a-button>

            <!-- 用户头像和下拉菜单 -->
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
                    个人资料
                  </a-menu-item>
                  <a-menu-item key="my-images" @click="handleMyImages">
                    <PictureOutlined />
                    我的图片
                  </a-menu-item>
                  <a-menu-item key="favorites" @click="handleFavorites">
                    <HeartOutlined />
                    我的收藏
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </div>
      </div>
    </a-layout-header>

    <!-- 主要内容区域 -->
    <a-layout-content class="content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </a-layout-content>

    <!-- 底部信息 -->
    <a-layout-footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>PicGallery</h3>
          <p>探索、分享、创造美丽的视觉内容</p>
          <div class="social-links">
            <a href="#" class="social-link"><GithubOutlined /></a>
            <a href="#" class="social-link"><TwitterOutlined /></a>
            <a href="#" class="social-link"><InstagramOutlined /></a>
          </div>
        </div>

        <div class="footer-section">
          <h4>探索</h4>
          <a href="#" class="footer-link">热门图片</a>
          <a href="#" class="footer-link">最新上传</a>
          <a href="#" class="footer-link">AI生成</a>
          <a href="#" class="footer-link">分类浏览</a>
        </div>

        <div class="footer-section">
          <h4>工具</h4>
          <a href="#" class="footer-link">图片上传</a>
          <a href="#" class="footer-link">AI绘图</a>
          <a href="#" class="footer-link">图片编辑</a>
          <a href="#" class="footer-link">批量下载</a>
        </div>

        <div class="footer-section">
          <h4>支持</h4>
          <a href="#" class="footer-link">帮助中心</a>
          <a href="#" class="footer-link">使用条款</a>
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">联系我们</a>
        </div>
      </div>

      <div class="footer-bottom">
        <a-space>
          <p>开发者 Remon</p>
          <a href="https://github.com/Remon-16" class="social-link"><GithubOutlined /></a>
        </a-space>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  CameraOutlined,
  UploadOutlined,
  RobotOutlined,
  UserOutlined,
  PictureOutlined,
  HeartOutlined,
  LogoutOutlined,
  DownOutlined,
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'

// 导入用户状态管理（假设使用Pinia）
// import { useUserStore } from '@/stores/user'

// 路由
const router = useRouter()
const route = useRoute()

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

// 生命周期
onMounted(() => {
  // 模拟用户登录状态检查
  setTimeout(() => {
    // userStore.isLoggedIn.value = true // 测试时取消注释
  }, 1000)
})
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 头部样式 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f0f0f0;
  padding: 0;
  height: 64px;
}

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
  width: 200px;
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

/* 内容区域样式 */
.content {
  margin-top: 64px;
  min-height: calc(100vh - 64px - 200px);
}

.content-wrapper {
  max-width: 2400px;
  margin: 0 auto;
  padding: 24px;
}

/* 底部样式 */
.footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 48px 0 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
}

.footer-section h3 {
  color: white;
  margin-bottom: 16px;
  font-size: 20px;
}

.footer-section h4 {
  color: white;
  margin-bottom: 16px;
  font-size: 16px;
}

.footer-section p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 16px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: background-color 0.3s;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  transition: color 0.3s;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 48px;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .nav-menu {
    display: none;
  }

  .search-input {
    width: 150px;
  }

  .user-actions {
    gap: 8px;
  }

  .username {
    display: none;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .content-wrapper {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .search-input {
    display: none;
  }

  .upload-btn span,
  .ai-draw-btn span {
    display: none;
  }
}
</style>
