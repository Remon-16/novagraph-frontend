<template>
  <a-card class="profile-card" :bordered="false">
    <!-- 头像区域 -->
    <div class="avatar-section">
      <div class="avatar-wrapper" @click="triggerFileInput">
        <a-avatar :size="100" :src="userInfo.avatar">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div class="avatar-overlay">点击更换</div>
      </div>

      <!-- 隐藏的文件上传 Input -->
      <input
        type="file"
        ref="fileInputRef"
        style="display: none"
        accept="image/jpeg,image/png,image/webp"
        @change="handleFileChange"
      >

      <h2 style="margin-top: 10px; margin-bottom: 0;">
        {{ userInfo.nickname }}
        <a-tag v-if="userInfo.isMember" color="gold" class="member-badge">VIP会员</a-tag>
        <a-tag v-else color="default" class="member-badge">普通用户</a-tag>
      </h2>
      <p style="color: #999; margin-top: 5px; font-size: 14px;">ID: {{ userInfo.userId }}</p>
    </div>

    <a-divider style="margin-bottom: 20px; margin-top: 10px;"></a-divider>

    <!-- 详细信息展示 -->
    <div class="descriptions-header">基本信息</div>
    <a-descriptions :column="2" bordered>
      <a-descriptions-item label="用户账号">{{ userInfo.account }}</a-descriptions-item>
      <a-descriptions-item label="用户积分">{{ userInfo.points }}</a-descriptions-item>
      <a-descriptions-item label="注册时间">{{ formatDate(userInfo.registerTime) }}</a-descriptions-item>
      <a-descriptions-item label="会员到期时间">
        <span v-if="userInfo.isMember" style="color: #cf1322;">{{ formatDate(userInfo.memberExpireTime) }}</span>
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="个人简介" :span="2">
        {{ userInfo.bio || '暂无简介' }}
      </a-descriptions-item>
    </a-descriptions>

    <!-- 底部按钮 -->
    <div style="margin-top: 24px; text-align: right;">
      <a-button type="primary" @click="openEditModal" :icon="h(EditOutlined)">
        编辑资料
      </a-button>
    </div>
  </a-card>

  <!-- 编辑资料 Modal 弹窗 -->
  <a-modal
    v-model:open="isModalVisible"
    title="编辑个人资料"
    @ok="handleSave"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <a-form
      :model="editForm"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="用户昵称" name="nickname" required>
        <a-input
          v-model:value="editForm.nickname"
          placeholder="请输入昵称"
          :maxlength="20"
          show-count
        />
      </a-form-item>

      <a-form-item label="个人简介" name="bio">
        <a-textarea
          v-model:value="editForm.bio"
          placeholder="介绍一下你自己..."
          :rows="4"
          :maxlength="200"
          show-count
        />
      </a-form-item>
    </a-form>
    
  </a-modal>
</template>

<script setup lang="ts">
import {
  UserOutlined, EditOutlined
} from '@ant-design/icons-vue'
import { h, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

// 模拟用户初始数据 (实际开发中这些数据来自后端 API)
const userInfo = reactive({
  userId: '10086888',
  account: 'user@example.com',
  nickname: '前端探索者',
  points: 5200,
  registerTime: '2023-01-15 10:30:00',
  isMember: true,
  memberExpireTime: '2027-12-31 23:59:59',
  bio: '热爱技术，专注于 Vue3 和 Web 开发。',
  avatar: 'https://picsum.photos/seed/user123/200/200.jpg'
});

// 编辑表单的数据状态
const editForm = reactive({
  nickname: '',
  bio: ''
});

// 组件状态
const isModalVisible = ref(false);
const loading = ref(false);
const fileInputRef = ref(null);

// 方法：打开编辑弹窗
const openEditModal = () => {
  // 将当前数据复制到编辑表单中
  editForm.nickname = userInfo.nickname;
  editForm.bio = userInfo.bio;
  isModalVisible.value = true;
};

// 方法：保存编辑
const handleSave = () => {
  if (!editForm.nickname.trim()) {
    message.warning('昵称不能为空');
    return;
  }

  loading.value = true;

  // 模拟网络请求延迟
  setTimeout(() => {
    // 更新用户信息
    userInfo.nickname = editForm.nickname;
    userInfo.bio = editForm.bio;

    loading.value = false;
    isModalVisible.value = false;
    message.success('资料更新成功');

    // TODO: 在此处调用后端 API 提交数据
  }, 800);
};

// 方法：取消编辑
const handleCancel = () => {
  isModalVisible.value = false;
};

// 方法：触发文件上传
const triggerFileInput = () => {
  fileInputRef.value.click();
};

// 方法：处理文件选择变化
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 1. 校验格式
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    message.error('仅支持 JPG、PNG 或 WebP 格式的图片');
    // 重置 input，防止重复选择同一文件不触发 change
    event.target.value = '';
    return;
  }

  // 2. 校验大小 (2MB = 2 * 1024 * 1024 bytes)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    message.error('图片大小不能超过 2MB');
    event.target.value = '';
    return;
  }

  // 3. 读取并预览图片
  const reader = new FileReader();
  reader.onload = (e) => {
    userInfo.avatar = e.target.result; // 更新头像显示
    message.success('头像已选择，请记得保存（模拟）');
    // TODO: 在此处调用后端 API 上传文件 (formData.append('file', file))
  };
  reader.readAsDataURL(file);

  // 清空 input value
  event.target.value = '';
};

// 工具方法：格式化日期 (简单示例，实际可用 dayjs)
const formatDate = (dateStr) => {
  if(!dateStr) return '';
  return dateStr; // 这里为了演示简单直接返回，实际可用 dayjs(dateStr).format('YYYY-MM-DD')
};
</script>

<style scoped>
/* 卡片容器样式 */
.profile-card {


  align-items: center;
}

/* 头像区域容器 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  padding-top: 20px;
}

/* 头像样式 */
.avatar-wrapper {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-wrapper:hover {
  transform: scale(1.02);
}

/* 头像悬停时的遮罩提示 */
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 12px;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

/* 会员标签样式 */
.member-badge {
  margin-left: 8px;
  vertical-align: middle;
}

.descriptions-header {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}
</style>
