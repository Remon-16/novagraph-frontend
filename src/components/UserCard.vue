<template>
  <a-card class="user-card" :body-style="{ padding: '20px' }">
    <div class="card-header">
      <a-avatar :src="user.avatar" :size="64" class="card-avatar" />
      <div class="card-nickname">{{ user.nickname }}</div>
      <div class="card-bio" :title="user.bio">{{ user.bio }}</div>
    </div>

    <!-- 关注列表按钮逻辑 -->
    <template v-if="type === 'following'">
      <a-dropdown :trigger="['hover']" placement="bottomCenter">
        <a-button class="card-action" block>
          已关注
          <DownOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleAction('unfollow')">
              <span style="color: #ff4d4f;">取消关注</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>

    <!-- 粉丝列表按钮逻辑 -->
    <template v-else-if="type === 'followers'">
      <a-dropdown :trigger="['hover']" placement="bottomCenter">
        <a-button class="card-action" block>
          粉丝
          <DownOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleAction('followBack')">关注</a-menu-item>
            <a-menu-item @click="handleAction('removeFan')">
              <span style="color: #ff4d4f;">移除粉丝</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import {
  DownOutlined,
} from '@ant-design/icons-vue'
import { anyType } from 'ant-design-vue/es/_util/type'

const props = defineProps({
  user: {
    type: anyType,
    required: true
  },
  type: {
    type: String,
    required: true
  },
});

const emit = defineEmits({})

const handleAction = (actionType: any) => {
  emit('action', { userId: props.user.id, action: actionType, user: props.user });
};
</script>

<style scoped>

/* 用户卡片样式 */
.user-card {
  height: 100%;
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}
.user-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #1890ff;
  transform: translateY(-2px);
}
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;
}
.card-avatar {
  width: 64px;
  height: 64px;
  margin-bottom: 12px;
}
.card-nickname {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}
.card-bio {
  font-size: 13px;
  color: #666;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 38px; /* 固定高度保持整齐 */
  line-height: 1.5;
}
.card-action {
  margin-top: 16px;
  width: 100%;
}
</style>
