<template>
  <div class="auth-container">
    <div class="background-overlay"></div>
    <div class="auth-content">
      <!-- 登录表单 -->
      <a-card
        v-if="currentView === 'login'"
        class="auth-card"
        :bordered="false"
      >
        <template #title>
          <div class="card-title">
            <div class="logo">
              <ImageIcon />
              <span>NovaGraph</span>
            </div>
            <h2>登录您的账户</h2>
            <p>探索、体验或创建好的故事</p>
          </div>
        </template>

        <a-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginFormRef"
          @finish="handleLogin"
          layout="vertical"
        >
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="loginForm.username"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="loginForm.password"
              placeholder="请输入密码"
              size="large"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </a-button>
          </a-form-item>

          <div class="auth-footer">
            <span>还没有账户？</span>
            <a @click="switchToRegister">立即注册</a>
          </div>
        </a-form>
      </a-card>

      <!-- 注册表单 -->
      <a-card
        v-else
        class="auth-card"
        :bordered="false"
      >
        <template #title>
          <div class="card-title">
            <div class="logo">
              <ImageIcon />
              <span>PicGallery</span>
            </div>
            <h2>创建新账户</h2>
            <p>加入我们，开启图片创作之旅</p>
          </div>
        </template>

        <a-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFormRef"
          @finish="handleRegister"
          layout="vertical"
        >
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="registerForm.username"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="用户昵称" name="nickname">
            <a-input
              v-model:value="registerForm.nickname"
              placeholder="请输入用户昵称"
              size="large"
            >
              <template #prefix>
                <SmileOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="registerForm.password"
              placeholder="请输入密码"
              size="large"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item label="确认密码" name="confirmPassword">
            <a-input-password
              v-model:value="registerForm.confirmPassword"
              placeholder="请再次输入密码"
              size="large"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              注册
            </a-button>
          </a-form-item>

          <div class="auth-footer">
            <span>已有账户？</span>
            <a @click="switchToLogin">立即登录</a>
          </div>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  LockOutlined,
  SmileOutlined
} from '@ant-design/icons-vue'

// 图标组件（实际项目中应使用真实图标）
const ImageIcon = {
  template: `<div class="image-icon">📷</div>`
}

// 响应式数据
const currentView = ref<'login' | 'register'>('login')
const loading = ref(false)
const loginFormRef = ref()
const registerFormRef = ref()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在2-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (value !== registerForm.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const switchToRegister = () => {
  currentView.value = 'register'
  resetForms()
}

const switchToLogin = () => {
  currentView.value = 'login'
  resetForms()
}

const resetForms = () => {
  loginFormRef.value?.resetFields()
  registerFormRef.value?.resetFields()
}

const handleLogin = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 实际项目中这里应该调用登录API
    console.log('登录信息:', loginForm)

    message.success('登录成功！')
    // 登录成功后跳转到首页或其他页面
  } catch (error) {
    message.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 实际项目中这里应该调用注册API
    console.log('注册信息:', {
      username: registerForm.username,
      nickname: registerForm.nickname,
      password: registerForm.password
    })

    message.success('注册成功！')
    // 注册成功后可以自动登录或跳转到登录页面
    currentView.value = 'login'
  } catch (error) {
    message.error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx=".5" cy=".5" r=".5"><stop offset="0%" stop-color="%23ffffff" stop-opacity=".05"/><stop offset="100%" stop-color="%23000" stop-opacity="0"/></radialGradient></defs><g fill="url(%23a)"><circle cx="200" cy="200" r="150"/><circle cx="800" cy="300" r="120"/><circle cx="600" cy="700" r="180"/><circle cx="300" cy="600" r="100"/></g></svg>');
  opacity: 0.1;
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.auth-card {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.card-title {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
}

.logo span {
  margin-left: 8px;
}

.image-icon {
  font-size: 28px;
}

.card-title h2 {
  margin: 0 0 8px;
  color: #262626;
  font-size: 24px;
  font-weight: 600;
}

.card-title p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.auth-footer {
  text-align: center;
  margin-top: 16px;
  color: #8c8c8c;
}

.auth-footer a {
  color: #1890ff;
  margin-left: 4px;
  cursor: pointer;
}

:deep(.ant-card-head-title) {
  padding: 24px 0 0;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 6px;
}

:deep(.ant-btn) {
  border-radius: 6px;
  height: 48px;
  font-weight: 500;
}
</style>
