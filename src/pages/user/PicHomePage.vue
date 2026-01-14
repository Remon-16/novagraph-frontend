<template>
  <div class="home-view">
    <a-flex justify="space-between">
    <h2>我的图片</h2>
    <a-space size="middle">
      <a-button
        type="primary"
        ghost
        target="_blank"
      >
        故事管理
      </a-button>
    </a-space>
    </a-flex>
    <ManageSearchForm :onSearch="manageSearch" form-type="pic"/>
    <!-- 1. 筛选区域 -->
    <CategoryFilter
      v-model:current-category="currentCategory"
      v-model:selected-tags="selectedTags"
      :categories="categories"
      :tags="allTags"
    />

    <!-- 2. 内容列表 -->
    <a-spin :spinning="loading">
      <a-row :gutter="[24, 24]">
        <a-col
          v-for="item in dataList"
          :key="item.id"
          :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
        >
          <SPCard
            :title="item.title"
            :image-url="item.imageUrl"
            :tags="item.tags"
            :views="item.views"
          />
        </a-col>
      </a-row>
    </a-spin>

    <!-- 3. 分页 (右下角) -->
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        show-size-changer
        show-quick-jumper
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryFilter from '@/components/CategoryFilter.vue'
import SPCard from '@/components/SPCard.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ManageSearchForm from '@/components/ManageSearchForm.vue'

const props = defineProps({
  externalSearchQuery: String
})

// --- 状态定义 ---
const currentCategory = ref('');
const selectedTags = ref([]);
const pagination = reactive({ current: 1, pageSize: 12, total: 0 });
const loading = ref(false);
const dataList = ref([]);
const searchQuery = ref('');

// 路由
const route = useRoute()

const manageSearch = () => {

};

// --- 模拟数据源 ---
const categories = ['动漫', '古风', '现代', '科幻', '风景'];
const allTags = ['搞笑', '生活', '创意', '唯美', '暗黑', '赛博朋克', '水墨'];

// 生成模拟数据的工具函数
const generateMockData = (count, keyword = '') => {
  const data = [];
  for (let i = 0; i < count; i++) {
    const id = Math.random().toString(36).substr(2, 9);
    // 如果有关键词，尽量模拟在标题里
    const titleSuffix = keyword ? ` - 关于${keyword}` : '';
    data.push({
      id: id,
      title: `创意作品展示 ${titleSuffix} #${i + 1}`,
      // 使用 Picsum 生成随机图片，添加随机种子防止缓存重复
      imageUrl: `https://picsum.photos/seed/${id}/400/300.jpg` ,
      tags: [allTags[Math.floor(Math.random() * allTags.length)], categories[Math.floor(Math.random() * categories.length)]],
      views: Math.floor(Math.random() * 5000)
    });
  }
  return data;
};

// --- 核心业务逻辑：获取数据 ---
const fetchData = () => {
  loading.value = true;
  // 模拟网络延迟
  setTimeout(() => {
    // 这里模拟根据搜索词、分类、标签筛选
    // 实际开发中这里是 this.http.get(...)
    const totalCount = 36; // 假设总共36条
    pagination.total = totalCount;

    // 生成当前页数据
    // 注意：这里我们假装 externalSearchQuery 影响了结果
    dataList.value = generateMockData(pagination.pageSize, props.externalSearchQuery);

    loading.value = false;

    // 如果是通过 Header 搜索进来的，给个小提示（仅演示用）
    if(props.externalSearchQuery && pagination.current === 1) {
      console.log(`搜索包含: ${props.externalSearchQuery}`);
    }
  }, 600);
};

// --- 监听与副作用 ---

// 监听 route 的变化，或者直接在初始化时获取
const getSearchQuery = () => {
  // 从 route.query.q 中获取，如果没有则默认为空字符串
  searchQuery.value = (route.query.q as string) || '';
  // 获取到后触发数据刷新
  fetchData();
};

// 监听分页变化
const onPageChange = (page) => {
  pagination.current = page;
  fetchData();
  // 回到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听筛选条件变化，重置回第一页
watch([currentCategory, selectedTags], () => {
  pagination.current = 1;
  fetchData();
});

// 监听外部搜索词（来自 Header）的变化
watch(() => props.externalSearchQuery, (newVal) => {
  console.log('Header search changed:', newVal);
  pagination.current = 1;
  fetchData();
});

// 监听路由变化（比如用户点了浏览器后退，或者再次点击搜索）
watch(() => route.query, () => {
  getSearchQuery();
}, { deep: true });

// 生命周期
onMounted(() => {
  // 初始化加载
  getSearchQuery()
})

</script>

<style scoped>

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-card:hover .card-cover img {
  transform: scale(1.05);
}

.card-tags .ant-tag {
  margin-bottom: 4px;
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding: 0 10px;
}

</style>
