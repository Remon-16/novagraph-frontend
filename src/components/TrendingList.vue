<template>
  <div class="card">
    <h4 style="margin-top:0; border-left: 3px solid #ff4d4f; padding-left: 8px;">实时热搜榜</h4>
    <ul class="trend-list">
      <li v-for="(item, index) in trends" :key="index" class="trend-item">
        <span class="rank-num" :class="{ 'rank-top': index < 3 }">{{ index + 1 }}</span>
        <div class="trend-info">
          <div class="trend-title">{{ item.title }}</div>
          <div class="trend-heat">{{ item.heat }} 热度</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { anyType } from 'ant-design-vue/es/_util/type'

const props = defineProps({
  trends: {
    type: anyType,
    required: true
  },
})
const trends = props.trends
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

.action-btn.liked span {
  font-weight: bold;
}

/* 右侧热搜 */
.trend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.trend-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.trend-item:last-child {
  border-bottom: none;
}
.rank-num {
  width: 24px;
  font-weight: bold;
  font-style: italic;
  color: var(--text-secondary);
  margin-right: 12px;
  text-align: center;
}
.rank-top {
  color: #ff4d4f;
}
.trend-info {
  flex: 1;
}
.trend-title {
  font-size: 14px;
  color: var(--text-main);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.trend-heat {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
