<template>
  <div class="card post-item">
    <div class="post-header">
      <div class="user-info-left" @click="$router ?$router.push('/user/' + post.userId) : null">
        <img :src="post.user.avatar" style="width: 40px; height: 40px; border-radius: 50%;" alt="头像">
        <div>
          <div>
            <span class="user-name">{{ post.user.name }}</span>
            <span style="color:#ff4d4f; font-size:12px; margin-left:4px;" v-if="post.user.isVip">VIP</span>
          </div>
          <div class="user-nick">{{ post.user.nickname }} · {{ post.time }}</div>
        </div>
      </div>
      <a-dropdown v-if="!post.isSelf">
        <a class="ant-dropdown-link" @click.prevent>
          <EllipsisOutlined style="font-size: 20px; color: #999;" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleUnfollow">
              <UserDeleteOutlined /> 取消关注
            </a-menu-item>
            <a-menu-item>
              <ExclamationCircleOutlined /> 举报
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- 用户发布的内容 -->
    <div class="post-content" v-html="post.content"></div>

    <!-- 引用/转发的内容 -->
    <div v-if="post.quote" class="quote-card">
      <div class="quote-title">
        <span>{{ post.quote.title }}</span>
        <span style="font-size: 12px; color: #888;">{{ post.quote.likes }} 赞</span>
      </div>
      <div style="font-size: 13px; color: #555; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        {{ post.quote.intro }}
      </div>
      <img v-if="post.quote.image" :src="post.quote.image" class="quote-img" alt="引用图">
    </div>

    <!-- 底部按钮 -->
    <div class="post-actions">
      <button class="action-btn" @click="$emit('open-repost', post)">
        <RetweetOutlined /> <span>{{ post.shares || '转发' }}</span>
      </button>
      <button class="action-btn" @click="$emit('open-comment', post)">
        <MessageOutlined /> <span>{{ post.comments || '评论' }}</span>
      </button>
      <button class="action-btn" :class="{ liked: post.isLiked }" @click="handleLike">
        <LikeFilled v-if="post.isLiked" />
        <LikeOutlined v-else />
        <span>{{ post.likes }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EllipsisOutlined,
  UserDeleteOutlined,
  ExclamationCircleOutlined,
  RetweetOutlined,
  MessageOutlined,
  LikeOutlined,
  LikeFilled
} from '@ant-design/icons-vue'
import { anyType } from 'ant-design-vue/es/_util/type'
const props = defineProps({
  post: {
    type: anyType,
    required: true
  },
})
const emit = defineEmits({})

const handleLike = () => {
  emit('like', props.post.id);
};

const handleUnfollow = () => {
  emit('unfollow', props.post.userId);
};

</script>

<style scoped>
/* 通用卡片样式 */
.card {
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  padding: 16px;
  margin-bottom: 16px;
}

/* 单条动态样式 */
.post-item {
  padding-bottom: 12px;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.user-info-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-weight: 600;
  color: var(--text-main);
}
.user-nick {
  color: var(--text-secondary);
  font-size: 13px;
}

/* 动态内容区域 */
.post-content {
  margin: 10px 0;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 引用/转发样式 */
.quote-card {
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.quote-card:hover {
  background-color: #f0f0f0;
}
.quote-title {
  font-weight: bold;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}
.quote-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 8px;
}

/* 底部操作栏 */
.post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}
.action-btn {
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
  background: none;
  border: none;
  font-size: 14px;
}
.action-btn:hover {
  color: var(--primary-color);
}
.action-btn.liked {
  color: #ff4d4f;
}
.action-btn.liked span {
  font-weight: bold;
}

</style>
