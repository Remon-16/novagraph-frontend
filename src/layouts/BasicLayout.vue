<template>
  <a-layout class="basic-layout">
    <!-- 头部导航 -->
    <a-layout-header class="header">
      <GlobalHeader />
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
import { onMounted } from 'vue'
import {
  CameraOutlined,
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined
} from '@ant-design/icons-vue'
import GlobalHeader from '@/components/GlobalHeader.vue'

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


/* 内容区域样式 */
.content {
  padding: 28px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
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
