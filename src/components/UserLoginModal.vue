<template>
  <a-modal
    v-model:open="modalOpen"
    :title="currentView === 'login' ? '登录' : '注册'"
    :footer="null"
    :width="440"
    centered
    :destroyOnClose="true"
    @cancel="handleCancel"
    class="auth-modal"
  >
    <!-- Tab切换 -->
    <div class="auth-tabs">
      <div
        class="tab-item"
        :class="{ active: currentView === 'login' }"
        @click="switchToLogin"
      >
        登录
      </div>
      <div class="tab-divider"></div>
      <div
        class="tab-item"
        :class="{ active: currentView === 'register' }"
        @click="switchToRegister"
      >
        注册
      </div>
    </div>

    <!-- 登录表单 -->
    <div v-show="currentView === 'login'" class="auth-form-container">
      <a-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        @finish="handleLogin"
        layout="vertical"
      >
        <a-form-item name="username">
          <template #label>
            <span class="form-label">用户名</span>
          </template>
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

        <a-form-item name="password">
          <template #label>
            <span class="form-label">密码</span>
          </template>
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

        <a-form-item style="margin-bottom: 0;">
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
      </a-form>
    </div>

    <!-- 注册表单 -->
    <div v-show="currentView === 'register'" class="auth-form-container">
      <a-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormRef"
        @finish="handleRegister"
        layout="vertical"
      >
        <a-form-item name="username">
          <template #label>
            <span class="form-label">用户名</span>
          </template>
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

        <a-form-item name="password">
          <template #label>
            <span class="form-label">密码</span>
          </template>
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

        <a-form-item name="confirmPassword">
          <template #label>
            <span class="form-label">确认密码</span>
          </template>
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

        <a-form-item style="margin-bottom: 0;">
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
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogin, userRegister } from '@/api/userController'
import router from '@/router'

// Props
interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false
})

// Emits
const emit = defineEmits<{
  'update:open': [value: boolean]
  'login-success': []
}>()

const loginUserStore = useLoginUserStore()

// 响应式数据
const currentView = ref<'login' | 'register'>('login')
const loading = ref(false)
const loginFormRef = ref()
const registerFormRef = ref()

// 控制模态框显示
const modalOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单数据
const registerForm = reactive({
  username: '',
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
  // 使用 nextTick 确保DOM更新后再重置
  setTimeout(() => {
    loginFormRef.value?.resetFields()
    registerFormRef.value?.resetFields()
  }, 0)
}

const handleCancel = () => {
  resetForms()
  currentView.value = 'login'
}

// 用户登录
const handleLogin = async () => {
  try {
    loading.value = true

    const values = {
      userAccount: loginForm.username,
      userPassword: loginForm.password,
    }

    const res = await userLogin(values)
    // 登录成功，把登录态保存到全局状态中
    if (res.data.code === 0 && res.data.data) {
      localStorage.setItem('authToken', res.data.data.token);
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true,
      })
    } else {
      message.error('登录失败，' + res.data.message)
    }

    // 触发登录成功事件
    emit('login-success')

  } catch (error) {
    message.error('登录失败，请重试')
    console.error('登录错误:', error)
  } finally {
    loading.value = false
  }
}

// 注册逻辑
const handleRegister = async () => {
  try {
    loading.value = true

    const values = {
      userAccount: registerForm.username,
      userPassword: registerForm.password,
      checkPassword: registerForm.confirmPassword,
    }

    const res = await userRegister(values)
    // 注册成功，跳转到登录页面
    if (res.data.code === 0 && res.data.data) {
      message.success('注册成功！请登录')
      // 注册成功后切换到登录
      switchToLogin()
    } else {
      message.error('注册失败，' + res.data.message)
    }

  } catch (error) {
    message.error('注册失败，请重试')
    console.error('注册错误:', error)
  } finally {
    loading.value = false
  }
}

// 监听模态框关闭，重置表单
watch(() => props.open, (newVal) => {
  if (!newVal) {
    resetForms()
    currentView.value = 'login'
  }
})
</script>

<style scoped>
/* Tab样式 */
.auth-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  padding: 0 20px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tab-item:hover {
  color: #1890ff;
}

.tab-item.active {
  color: #1890ff;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: #1890ff;
  border-radius: 2px;
}

.tab-divider {
  width: 1px;
  height: 24px;
  background: #e8e8e8;
  margin: 0 16px;
}

/* 表单样式 */
.auth-form-container {
  padding: 0 20px 20px;
}

.form-label {
  font-weight: 500;
  color: #262626;
}

:deep(.ant-input-affix-wrapper),
:deep(.ant-input) {
  border-radius: 6px;
}

:deep(.ant-btn) {
  border-radius: 6px;
  height: 44px;
  font-weight: 500;
  margin-top: 8px;
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-modal-body) {
  padding: 20px 0 0;
}
</style>

<style>
/* 全局模态框样式覆盖 */
.auth-modal .ant-modal-header {
  border-bottom: none;
  padding-bottom: 0;
  text-align: center;
}

.auth-modal .ant-modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.auth-modal .ant-modal-close {
  top: 16px;
}

.auth-modal .ant-modal-close-x {
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
</style>
