<template>
  <a-row justify="center">
    <a-col :xs="24" :sm="24" :md="24" :lg="20">
      <div class="layout-container">

        <!-- 左侧：用户信息 -->
        <div class="left-column" style="width: 280px; flex-shrink: 0;">
          <UserInfo :user="currentUser" />
        </div>

        <!-- 中间：动态流 -->
        <div class="feed-column">
          <!-- 发布器 -->
          <CreatePost @post-submit="handleNewPost" />

          <!-- 动态列表 -->
          <div class="feed-list-container" ref="feedListRef">
            <div v-if="loading" style="text-align: center; padding: 20px;">
              <a-spin />
            </div>
            <PostItem
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @like="handleLike"
              @unfollow="handleUnfollow"
              @open-comment="openCommentModal"
              @open-repost="openRepostModal"
            />
            <div v-if="!loading && posts.length > 0" style="text-align: center; padding: 20px; color: #999;">
              <a-spin v-if="loadingMore" />
              <span v-else>没有更多动态了</span>
            </div>
          </div>
        </div>

        <!-- 右侧：热搜榜 -->
        <div class="trending-column">
          <div class="sticky-right">
            <TrendingList :trends="trendingData" />
          </div>
        </div>

      </div>
    </a-col>
  </a-row>

  <!-- 评论弹窗 -->
  <a-modal v-model:open="commentModalVisible" title="写评论" @ok="submitComment" ok-text="发送">
    <a-textarea v-model:value="commentText" :rows="4" placeholder="说点什么吧..." />
  </a-modal>

  <!-- 转发弹窗 -->
  <a-modal v-model:open="repostModalVisible" title="转发动态" @ok="submitRepost" ok-text="发送">
    <a-textarea v-model:value="repostText" :rows="4" placeholder="说说你的看法..." />
    <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 12px; color: #666;">
      // 引用原动态内容...
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import UserInfo from '@/components/UserInfo.vue'
import PostItem from '@/components/PostItem.vue'
import TrendingList from '@/components/TrendingList.vue'
import CreatePost from '@/components/CreatePost.vue'


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

// 弹窗状态
const commentModalVisible = ref(false);
const repostModalVisible = ref(false);
const commentText = ref('');
const repostText = ref('');
const activePostId = ref(null);

// 加载状态
const loading = ref(true);
const loadingMore = ref(false);
const feedListRef = ref(null);

// 生成模拟动态数据
const generatePosts = (count, startId = 1) => {
  const users = [
    { name: '设计达人', nickname: 'design_guru', avatar: 'https://picsum.photos/seed/user1/100/100' },
    { name: '科技观察', nickname: 'tech_observer', avatar: 'https://picsum.photos/seed/user2/100/100' },
    { name: '摸鱼办事处', nickname: 'moyu_master', avatar: 'https://picsum.photos/seed/user3/100/100' },
  ];

  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    const isSelf = id % 5 === 0; // 每5条是自己发的
    const hasQuote = id % 3 === 0; // 每3条带引用
    const user = isSelf ? currentUser.value : users[i % users.length];

    return {
      id: id,
      userId: user.nickname, // 简化ID
      isSelf: isSelf,
      user: user,
      time: `${Math.floor(Math.random() * 23) + 1}小时前`,
      content: isSelf
        ? '今天重构了动态列表的代码，性能提升了很多！Vue3 的 Composition API 真香。🚀 #前端开发'
        : `分享一个非常有用的设计技巧，关于如何提升用户体验的。大家觉得怎么样？/doge`,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 200),
      shares: Math.floor(Math.random() * 50),
      isLiked: false,
      quote: hasQuote ? {
        title: '2024年Web开发趋势报告',
        intro: '深入分析了AI辅助编程、WebAssembly的普及以及框架演进...',
        image: 'https://picsum.photos/seed/post' + id + '/400/200',
        likes: 342
      } : null
    };
  });
};

const posts = ref([]);
const trendingData = ref([
  { title: 'Vue3.4 新特性解析', heat: '520w' },
  { title: 'CSS Grid 布局指南', heat: '340w' },
  { title: '独立开发者如何盈利', heat: '280w' },
  { title: 'TypeScript 高级技巧', heat: '250w' },
  { title: '2024 设计流行色', heat: '210w' },
  { title: '如何构建高性能Web应用', heat: '180w' },
  { title: 'Ant Design Vue 实战', heat: '150w' },
  { title: 'Vite 构建优化', heat: '120w' },
  { title: '前端面试题汇总', heat: '90w' },
  { title: 'Chrome 插件开发入门', heat: '60w' },
]);

// 初始化加载
onMounted(() => {
  setTimeout(() => {
    posts.value = generatePosts(5);
    loading.value = false;
    setupInfiniteScroll();
  }, 800);
});

// 模拟无限滚动
const setupInfiniteScroll = () => {
  const container = feedListRef.value;
  if (!container) return;

  container.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !loadingMore.value) {
      loadMorePosts();
    }
  });
};

const loadMorePosts = () => {
  loadingMore.value = true;
  setTimeout(() => {
    const newPosts = generatePosts(3, posts.value.length + 1);
    posts.value = [...posts.value, ...newPosts];
    loadingMore.value = false;
  }, 1000);
};

// 交互逻辑
const handleNewPost = (content) => {
  const newPost = {
    id: Date.now(),
    userId: currentUser.value.nickname,
    isSelf: true,
    user: currentUser.value,
    time: '刚刚',
    content: content,
    likes: 0,
    comments: 0,
    shares: 0,
    isLiked: false,
    quote: null
  };
  posts.value.unshift(newPost);
};

const handleLike = (postId) => {
  const post = posts.value.find(p => p.id === postId);
  if (post) {
    if (post.isLiked) {
      post.likes--;
      post.isLiked = false;
    } else {
      post.likes++;
      post.isLiked = true;
      message.success('点赞成功');
    }
  }
};

const handleUnfollow = (userId) => {
  // 实际逻辑是调用API，这里前端模拟：移除该用户的所有动态（或仅隐藏该条）
  // 需求说：取关之后动态就不会出现在这个动态列表里了
  posts.value = posts.value.filter(p => p.userId !== userId);
  message.info('已取消关注，相关动态已移除');
};

const openCommentModal = (post) => {
  activePostId.value = post.id;
  commentText.value = '';
  commentModalVisible.value = true;
};

const submitComment = () => {
  if(!commentText.value.trim()) return;
  const post = posts.value.find(p => p.id === activePostId.value);
  if(post) {
    post.comments++;
    message.success('评论发表成功');
  }
  commentModalVisible.value = false;
};

const openRepostModal = (post) => {
  activePostId.value = post.id;
  repostText.value = '';
  repostModalVisible.value = true;
};

const submitRepost = () => {
  const post = posts.value.find(p => p.id === activePostId.value);
  if(post) {
    post.shares++;
    // 实际上这里会生成一条新的动态
    message.success('转发成功');
  }
  repostModalVisible.value = false;
};

</script>

<style scoped>

/* 布局容器 */
.layout-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 中间动态区 */
.feed-column {
  flex: 1;
  min-width: 0; /* 防止flex子项溢出 */
}

/* 动态列表容器 */
.feed-list-container {
  min-height: 500px;
}

/* 右侧热搜 */
.trending-column {
  width: 300px;
  flex-shrink: 0;
}
.sticky-right {
  position: sticky;
  top: 20px;
}


</style>
