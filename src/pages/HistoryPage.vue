<template>
  <a-layout style="height: 100%;">
    <!-- 左侧时间导航 -->
    <a-layout-sider width="256" class="layout-sider">
      <div style="padding: 16px 24px; font-weight: bold; font-size: 16px; border-bottom: 1px solid #f0f0f0;">
        浏览时间
      </div>
      <a-menu
        v-model:selectedKeys="selectedTimeKeys"
        mode="inline"
        class="time-menu"
        @click="handleTimeFilterClick"
      >
        <a-menu-item key="all">
          <ClockCircleOutlined /> 所有历史
        </a-menu-item>
        <a-menu-item key="today">
          <CalendarOutlined /> 今天
        </a-menu-item>
        <a-menu-item key="yesterday">
          <CalendarOutlined /> 昨天
        </a-menu-item>
        <a-menu-item key="3days">
          <CalendarOutlined /> 三天前
        </a-menu-item>
        <a-menu-item key="week">
          <CalendarOutlined /> 一周前
        </a-menu-item>
        <a-menu-item key="month">
          <CalendarOutlined /> 30天前
        </a-menu-item>
        <a-menu-item key="older">
          <CalendarOutlined /> 更早
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 右侧内容 -->
    <a-layout-content class="layout-content">
      <!-- 顶部工具栏 -->
      <div class="content-header">
        <div class="header-left">
          {{ currentFilterLabel }}
        </div>

        <div class="header-actions">
          <!-- 搜索框 -->
          <a-input-search
            v-model:value="searchQuery"
            placeholder="搜索历史记录..."
            style="width: 250px;"
          />

          <!-- 清空按钮 -->
          <a-button danger @click="openClearHistoryModal">
            <template #icon><DeleteOutlined /></template> 清空历史
          </a-button>

          <!-- 开关 -->
          <div style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
            <span>记录历史</span>
            <a-switch v-model:checked="isRecordingHistory" checked-children="开" un-checked-children="关" />
          </div>
        </div>
      </div>

      <!-- 滚动内容区 -->
      <div class="scrollable-container" ref="scrollContainer" @scroll="handleScroll">
        <a-spin :spinning="initialLoading">
          <a-row :gutter="[16, 16]">
            <a-col :span="4" v-for="item in displayedItems" :key="item.id">
              <a-card
                hoverable
                class="content-card"
                :body-style="{ padding: '12px' }"
              >

                <!-- 封面 -->
                <img :src="item.cover" alt="cover" class="card-cover" loading="lazy">

                <!-- 标题与时间 -->
                <div class="card-info">
                  <div class="card-title" :title="item.title">
                    {{ item.title }}
                  </div>
                  <div class="card-time">
                    {{ formatTime(item.timestamp) }}
                  </div>
                  <div class="card-time">
                    <!-- 删除按钮 -->
                    <a-button
                      type="primary"
                      danger
                      shape="circle"
                      size="small"
                      class="card-delete-btn"
                      @click.stop="confirmDeleteItem(item)"
                    >
                      <template #icon><DeleteOutlined /></template>
                    </a-button>
                  </div>
                </div>
              </a-card>
            </a-col>

            <!-- 空状态 -->
            <a-col :span="24" v-if="displayedItems.length === 0 && !initialLoading">
              <a-empty description="暂无浏览历史" />
            </a-col>
          </a-row>

          <!-- 底部加载状态 -->
          <div class="loading-spinner" v-if="isLoading && displayedItems.length > 0">
            <a-spin tip="加载更多..." />
          </div>
          <div class="loading-spinner" v-if="!hasMore && displayedItems.length > 0">
            没有更多了
          </div>
        </a-spin>
      </div>
    </a-layout-content>
  </a-layout>

  <!-- 清空历史范围选择模态框 -->
  <a-modal
    v-model:open="clearHistoryModalVisible"
    title="选择清空范围"
    ok-text="确认清空"
    cancel-text="取消"
    @ok="handleClearHistoryConfirm"
  >
    <p>请选择要清空的时间范围：</p>
    <a-radio-group v-model:value="clearTimeRange" style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
      <a-radio value="1d">近 1 天</a-radio>
      <a-radio value="1w">近 1 周</a-radio>
      <a-radio value="1m">近 1 个月</a-radio>
      <a-radio value="3m">近 3 个月</a-radio>
      <a-radio value="all">所有历史</a-radio>
    </a-radio-group>
  </a-modal>
</template>

<script setup lang="ts">
import {
  ClockCircleOutlined, CalendarOutlined, DeleteOutlined, LoadingOutlined
} from '@ant-design/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'

// --- 状态数据 ---
const isRecordingHistory = ref(true); // 记录历史开关
const selectedTimeKeys = ref(['all']); // 当前选中的时间过滤
const searchQuery = ref('');

// 模拟生成历史数据
const allHistoryItems = ref([]);

// 渲染控制
const displayedItems = ref([]); // 当前页面显示的数据（滚动分页用）
const currentPage = ref(1);
const pageSize = 36; // 每次加载的数量
const isLoading = ref(false);
const hasMore = ref(true);
const initialLoading = ref(true);
const scrollContainer = ref(null);

// 清空历史 Modal 状态
const clearHistoryModalVisible = ref(false);
const clearTimeRange = ref('1d');

// --- 生成模拟数据 ---
const generateMockHistory = (count) => {
  const items = [];
  const now = DateHelper.now();
  for (let i = 1; i <= count; i++) {
    // 随机生成过去90天内的时间
    const randomTimeOffset = Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000);
    const timestamp = new Date(now.getTime() - randomTimeOffset);

    items.push({
      id: `history-${i}`,
      title: `浏览内容记录 ${i} - 这是一个模拟的浏览历史标题`,
      cover: `https://picsum.photos/seed/${i + 500}/300/200`, // 避免和收藏夹封面完全一样
      timestamp: timestamp
    });
  }
  // 按时间倒序排序（最新的在前）
  return items.sort((a, b) => b.timestamp - a.timestamp);
};

// --- 生命周期 ---
onMounted(() => {
  // 初始化生成 200 条数据
  allHistoryItems.value = generateMockHistory(200);
  loadItems();
  initialLoading.value = false;
});

// --- 计算属性 ---

// 过滤后的总数据（不含分页逻辑）
const filteredItems = computed(() => {
  let items = allHistoryItems.value;

  // 1. 时间过滤
  const key = selectedTimeKeys.value[0];
  if (key !== 'all') {
    const now = DateHelper.now();
    items = items.filter(item => {
      const diff = (now - item.timestamp) / (1000 * 60 * 60 * 24);
      if (key === 'today') return DateHelper.isToday(item.timestamp);
      if (key === 'yesterday') return DateHelper.isYesterday(item.timestamp);
      if (key === '3days') return diff <= 3 && diff > 1; // 3天内，排除今天和昨天
      if (key === 'week') return diff <= 7;
      if (key === 'month') return diff <= 30;
      if (key === 'older') return diff > 30;
      return true;
    });
  }

  // 2. 搜索过滤
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(item => item.title.toLowerCase().includes(q));
  }
  return items;
});

const currentFilterLabel = computed(() => {
  const map = {
    'all': '所有历史',
    'today': '今天',
    'yesterday': '昨天',
    '3days': '最近三天',
    'week': '最近一周',
    'month': '最近30天',
    'older': '30天以前'
  };
  return map[selectedTimeKeys.value[0]] || '所有历史';
});

// --- 方法 ---

// 切换时间过滤器
const handleTimeFilterClick = ({ key }) => {
  selectedTimeKeys.value = [key];
  resetLoad();
};

// 重置加载状态
const resetLoad = () => {
  displayedItems.value = [];
  currentPage.value = 1;
  hasMore.value = true;
  loadItems();
};

// 加载核心逻辑
const loadItems = () => {
  if (!hasMore.value || isLoading.value) return;

  isLoading.value = true;

  // 模拟网络延迟
  setTimeout(() => {
    const total = filteredItems.value;
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const newItems = total.slice(start, end);

    displayedItems.value = [...allHistoryItems.value, ...newItems];
    currentPage.value++;

    if (displayedItems.value.length >= total.length) {
      hasMore.value = false;
    }
    isLoading.value = false;
  }, 300);
};

// 监听滚动
const handleScroll = (e) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target;
  // 距离底部 50px 时加载
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    loadItems();
  }
};

// 格式化时间显示
const formatTime = (date) => {
  if (DateHelper.isToday(date)) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `今天 ${h}:${m}`;
  }
  return DateHelper.format(date);
};

// --- 删除逻辑 ---
const confirmDeleteItem = (item) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条浏览记录吗？',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      allHistoryItems.value = allHistoryItems.value.filter(i => i.id !== item.id);
      // 从当前显示列表中移除，避免重新加载导致的闪烁
      displayedItems.value = displayedItems.value.filter(i => i.id !== item.id);
      message.success('已删除');
    }
  });
};

// --- 清空历史逻辑 ---
const openClearHistoryModal = () => {
  clearTimeRange.value = '1d'; // 重置默认选项
  clearHistoryModalVisible.value = true;
};

const handleClearHistoryConfirm = () => {
  const now = DateHelper.now();
  const range = clearTimeRange.value;
  let cutoffDate = new Date(0); // 默认全部删除（1970年）

  if (range === '1d') cutoffDate = new Date(now - 24 * 60 * 60 * 1000);
  if (range === '1w') cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
  if (range === '1m') cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
  if (range === '3m') cutoffDate = new Date(now - 90 * 24 * 60 * 60 * 1000);

  // 执行过滤
  if (range === 'all') {
    allHistoryItems.value = [];
  } else {
    // 删除指定时间范围内的数据（时间大于cutoffDate，即更新的数据）
    // 这里的逻辑是：删除"近X天"的，意味着保留"比近X天更早的"
    allHistoryItems.value = allHistoryItems.value.filter(item => item.timestamp < cutoffDate);
  }

  message.success(`已清空 ${range === 'all' ? '所有' : '指定范围'} 历史记录`);
  clearHistoryModalVisible.value = false;
  resetLoad();
};

// --- 简单的日期辅助函数 ---
const DateHelper = {
  now: () => new Date(),
  isToday: (d) => {
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  },
  isYesterday: (d) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();
  },
  diffDays: (d) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0,0,0,0);
    d.setHours(0,0,0,0);
    return Math.floor(Math.abs((d - today) / oneDay));
  },
  format: (d) => {
    const pad = (n) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
};
</script>

<style scoped>
/* 布局样式 */
.layout-sider {
  background: #fff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}
.time-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
}
.time-menu .ant-menu-item-selected {
  background-color: #e6f7ff;
}

.layout-content {
  background: #fff;
  margin: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止外层滚动，内部滚动 */
}

/* 顶部操作栏 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0; /* 防止被压缩 */
}
.header-left {
  font-size: 18px;
  font-weight: bold;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 滚动加载区域 */
.scrollable-container {
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding-right: 4px; /* 留出滚动条位置避免遮挡 */
}
/* 滚动条美化 */
.scrollable-container::-webkit-scrollbar {
  width: 6px;
}
.scrollable-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

/* 卡片样式 */
.content-card {
  margin-bottom: 24px;
  transition: all 0.3s;
  position: relative;
}
.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.card-cover {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 4px;
}
.card-info {
  padding-top: 12px;
}
.card-title {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}
.card-time {
  font-size: 12px;
  color: #999;
}

/* 直接显示的删除按钮 */
.card-delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0; /* 默认隐藏，hover显示，或者一直显示 */
  transition: opacity 0.2s;
  z-index: 10;
}
.card-delete-btn { opacity: 1 }

.loading-spinner {
  text-align: center;
  padding: 20px 0;
  color: #999;
}
</style>
