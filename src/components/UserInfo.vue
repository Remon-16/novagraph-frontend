<template>
  <div class="card user-profile">
    <img :src="user.avatar" class="avatar-large" alt="用户头像">
    <div style="font-weight: bold; font-size: 18px;">{{ user.name }}</div>
    <div style="color: #888; font-size: 14px; margin-bottom: 10px;">@{{ user.nickname }}</div>

    <div style="font-size: 13px; color: #555; text-align: left; padding: 0 10px;">
      {{ user.bio }}
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-num">{{ formatNumber(user.following) }}</span>
        <span class="stat-label">关注</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ formatNumber(user.followers) }}</span>
        <span class="stat-label">粉丝</span>
      </div>
      <div class="stat-item">
        <span class="stat-num">{{ formatNumber(user.activities) }}</span>
        <span class="stat-label">动态</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { anyType } from 'ant-design-vue/es/_util/type'

const props = defineProps({
  user: {
    type: anyType,
    required: true
  },
});

const formatNumber = (num) => {
  return num > 10000 ? (num / 10000).toFixed(1) + 'w' : num;
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

/* 左侧用户信息 */
.user-profile {
  text-align: center;
  position: sticky;
  top: 20px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stats-row {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.stat-num {
  font-weight: bold;
  font-size: 18px;
  color: var(--text-main);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
