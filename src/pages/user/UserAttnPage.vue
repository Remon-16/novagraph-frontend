<template>
  <a-layout style="max-width: 1200px; margin: 0 auto; padding: 24px; background: transparent;">
    <!-- 左侧边栏组件 -->
    <a-layout-sider width="280" style="background: transparent;">
      <UserInfo
        :user="currentUser"
      ></UserInfo>
    </a-layout-sider>

    <!-- 右侧内容区域 -->
    <a-layout-content class="content-layout">
      <div v-if="currentTab === 'following'">
        <div class="page-header-title">我的关注</div>
        <user-grid
          type="following"
          :data-source="followingList"
          :total="followingTotal"
          :page-size="24"
          @page-change="onPageChange"
        ></user-grid>
      </div>

      <div v-else-if="currentTab === 'followers'">
        <div class="page-header-title">我的粉丝</div>
        <user-grid
          type="followers"
          :data-source="followersList"
          :total="followersTotal"
          :page-size="24"
          @page-change="onPageChange"
        ></user-grid>
      </div>

      <a-empty v-else description="请点击左侧查看关注或粉丝" style="margin-top: 100px;" />
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">

// ==========================================
// Mock 数据生成工具 (模拟后端数据)
// ==========================================
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import UserInfo from '@/components/UserInfo.vue'
import UserGrid from '@/components/UserGrid.vue'

function generateUsers(count, type) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: `${type}-${i}`,
      nickname: `${type === 'following' ? '关注用户' : '粉丝用户'}${i}`,
      avatar: `https://picsum.photos/seed/${type}${i}/200/200` ,
      bio: `这是一个${type === 'following' ? '我关注的' : '关注我的'}用户的简介。这里是个人简介的文本，可能会很长，需要截断显示。`,
      isFollowing: type === 'following' // 默认如果是关注列表，则是已关注
    });
  }
  return users;
}

// 状态管理
const currentTab = ref('following'); // 'following' | 'followers' | null

// 模拟当前用户
const currentUser = ref({
  name: '前端大师兄',
  nickname: 'frontend_master',
  avatar: 'https://picsum.photos/seed/me/200/200' ,
  bio: '热爱Vue，热爱生活。正在开发自己的独立产品。',
  following: 142,
  followers: 5300,
  activities: 89
});

// 模拟数据总数
const followingTotal = ref(128);
const followersTotal = ref(3560);

// 当前显示的列表数据 (每页24个)
const followingList = ref([]);
const followersList = ref([]);

// 模拟获取数据的方法
const fetchData = (page) => {
  console.log(`正在加载第 ${page} 页数据...`);
  // 模拟API请求延迟
  // 这里只是根据页码生成假数据，实际应调用后端接口
  followingList.value = generateUsers(24, 'following');
  followersList.value = generateUsers(24, 'followers');
};

// 初始化加载第一页
fetchData(1);

// 事件处理
const handleSwitchTab = (tab) => {
  currentTab.value = tab;
  // 切换Tab时重置为第一页并刷新数据（实际开发中通常这么做，或者保留各自的分页状态）
  fetchData(1);
};

const onPageChange = (page) => {
  fetchData(page);
};

const handleUserAction = ({ action, user }) => {
  // 这里预留后端交互逻辑
  if (action === 'unfollow') {
    message.success(`已取消关注：${user.nickname}`);
    // 逻辑：从前端列表移除该用户或更新状态
  } else if (action === 'followBack') {
    message.success(`已关注：${user.nickname}`);
  } else if (action === 'removeFan') {
    message.warning(`已移除粉丝：${user.nickname}`);
  }
};

</script>

<style scoped>
.content-layout {
  padding: 0 24px;
}
.page-header-title {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}

</style>
