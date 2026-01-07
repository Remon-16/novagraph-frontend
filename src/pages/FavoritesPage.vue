<template>
  <a-layout>
    <!-- 左侧侧边栏 -->
    <a-layout-sider width="256" class="layout-sider">
      <div class="folder-operations">
        <a-space style="width: 100%; justify-content: space-between;">
          <a-button type="primary" size="small" @click="openNewFolderModal">
            <template #icon><PlusOutlined /></template> 新建
          </a-button>
          <a-button size="small" @click="toggleManageMode">
            <template #icon><SettingOutlined /></template>
            {{ isManaging ? '完成' : '管理' }}
          </a-button>
        </a-space>
      </div>

      <div class="folder-list">
        <a-menu v-model:selectedKeys="selectedFolderKeys" mode="inline">
          <a-menu-item
            v-for="folder in folders"
            :key="folder.id"
            @click="handleFolderClick(folder)"
          >
            <div class="folder-item">
                                <span>
                                    <FolderOutlined style="margin-right: 8px;" />
                                    {{ folder.name }}
                                </span>
              <!-- 管理模式下显示的按钮 (默认文件夹除外) -->
              <span v-if="isManaging && folder.id !== 'default'">
                                    <a-button type="text" size="small" @click.stop="openEditFolderModal(folder)">
                                        <EditOutlined />
                                    </a-button>
                                    <a-button type="text" size="small" danger @click.stop="openDeleteFolderModal(folder)">
                                        <DeleteOutlined />
                                    </a-button>
                                </span>
            </div>
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-sider>

    <!-- 右侧主要内容区 -->
    <a-layout-content class="layout-content">
      <!-- 顶部搜索栏 -->
      <div class="content-header">
        <div style="font-size: 18px; font-weight: bold;">
          {{ currentFolder ? currentFolder.name : '加载中...' }}
          <span style="font-size: 12px; color: #999; font-weight: normal; margin-left: 10px;">
                            共 {{ filteredItems.length }} 项内容
                        </span>
        </div>
        <a-input-search
          v-model:value="searchQuery"
          placeholder="搜索标题..."
          style="width: 300px;"
          @search="onSearch"
        />
      </div>

      <!-- 内容列表区 -->
      <div class="scrollable-content">
        <a-row :gutter="[16, 16]">
          <!-- 循环渲染内容卡片 -->
          <a-col :span="4" v-for="item in paginatedItems" :key="item.id">
            <a-card
              hoverable
              class="content-card"
              :body-style="{ padding: '12px' }"
            >
              <!-- 封面图 -->
              <img
                :src="item.cover"
                alt="cover"
                class="card-cover"
                loading="lazy"
              >

              <!-- 标题 -->
              <div class="card-title" :title="item.title">
                {{ item.title }}
              </div>

              <!-- 操作按钮 -->
              <div class="card-action">
                <a-dropdown trigger="click">
                  <a-button type="text" size="small" shape="circle">
                    <MoreOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="removeItem(item)">
                        <StopOutlined /> 移除收藏夹
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </a-card>
          </a-col>

          <!-- 空状态 -->
          <a-col :span="24" v-if="paginatedItems.length === 0">
            <a-empty description="暂无内容" />
          </a-col>
        </a-row>
      </div>

      <!-- 底部传统分页 -->
      <div class="pagination-area" v-show="totalPages > 1">
        <a-pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :total="filteredItems.length"
          show-total
          show-less-items
          show-quick-jumper
          @change="onPageChange"
        />
      </div>
    </a-layout-content>
  </a-layout>

  <!-- 新建/编辑收藏夹 模态框 -->
  <a-modal
    v-model:open="folderModalVisible"
    :title="isEditingFolder ? '编辑收藏夹' : '新建收藏夹'"
    @ok="handleFolderModalOk"
  >
    <a-input
      v-model:value="folderNameInput"
      placeholder="请输入收藏夹名称"
      :maxlength="20"
      show-count
    />
  </a-modal>

  <!-- 删除收藏夹选项模态框 -->
  <a-modal
    v-model:open="deleteFolderModalVisible"
    title="确认删除收藏夹"
    ok-text="确认删除"
    cancel-text="取消"
    @ok="handleDeleteFolderConfirm"
  >
    <p>删除 "{{ deletingFolder?.name }}" 后，其中的内容如何处理？</p>
    <a-radio-group v-model:value="deleteActionType">
      <a-radio value="clear">清空所有内容</a-radio>
      <a-radio value="move">移动到默认收藏夹</a-radio>
    </a-radio-group>
  </a-modal>
</template>

<script setup lang="ts">
import {
  PlusOutlined, SettingOutlined, FolderOutlined, EditOutlined, DeleteOutlined,
  MoreOutlined, StopOutlined
} from '@ant-design/icons-vue'
import { computed, ref, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'

// --- 状态数据 ---
const folders = ref([
  { id: 'default', name: '默认收藏夹' },
  { id: 'f1', name: '技术文档' },
  { id: 'f2', name: '设计灵感' },
  { id: 'f3', name: '有趣的视频' },
  { id: 'f4', name: '待阅读' }
]);

// 模拟生成内容的工具函数
const generateMockItems = (count) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: `item-${i}`,
      title: `收藏内容示例标题 ${i} - 这是一个很长的标题用来测试截断效果`,
      cover: `https://picsum.photos/seed/${i}/300/200` ,
      folderId: i % 5 === 0 ? 'f1' : (i % 4 === 0 ? 'f2' : 'default') // 分配到不同文件夹
    });
  }
  return items;
};

// 所有内容数据
const allItems = ref(generateMockItems(120)); // 生成120条模拟数据

// 当前选中的文件夹ID
const selectedFolderKeys = ref(['default']);
const currentFolder = ref(folders.value[0]);

// 搜索关键词
const searchQuery = ref('');

// 分页相关
const currentPage = ref(1);
const pageSize = ref(36); // 每页最多36个

// 管理模式状态
const isManaging = ref(false);

// 文件夹模态框状态
const folderModalVisible = ref(false);
const folderNameInput = ref('');
const isEditingFolder = ref(false);
const editingFolderId = ref(null);

// 删除文件夹模态框状态
const deleteFolderModalVisible = ref(false);
const deletingFolder = ref(null);
const deleteActionType = ref('clear'); // 'clear' | 'move'

// --- 计算属性 ---

// 根据当前文件夹和搜索词筛选内容
const filteredItems = computed(() => {
  let items = allItems.value.filter(item => item.folderId === currentFolder.value.id);
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(item => item.title.toLowerCase().includes(q));
  }
  return items;
});

// 当前页显示的数据
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredItems.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => Math.ceil(filteredItems.value.length / pageSize.value));

// --- 方法定义 ---

// 切换管理模式
const toggleManageMode = () => {
  isManaging.value = !isManaging.value;
};

// 点击文件夹
const handleFolderClick = (folder) => {
  currentFolder.value = folder;
  selectedFolderKeys.value = [folder.id];
  currentPage.value = 1; // 切换文件夹重置页码
  searchQuery.value = ''; // 清空搜索
};

// 搜索
const onSearch = () => {
  currentPage.value = 1;
};

// 监听搜索框变化实时搜索（可选，这里为了性能保留按钮触发，或者直接用computed即可）
watch(searchQuery, () => {
  currentPage.value = 1;
});

// 分页改变
const onPageChange = (page) => {
  console.log('Page changed:', page);
};

// --- 文件夹操作逻辑 ---

const openNewFolderModal = () => {
  isEditingFolder.value = false;
  folderNameInput.value = '';
  folderModalVisible.value = true;
};

const openEditFolderModal = (folder) => {
  isEditingFolder.value = true;
  editingFolderId.value = folder.id;
  folderNameInput.value = folder.name;
  folderModalVisible.value = true;
};

const handleFolderModalOk = () => {
  if (!folderNameInput.value.trim()) {
    message.warning('请输入收藏夹名称');
    return;
  }

  if (isEditingFolder.value) {
    // 编辑逻辑
    const folder = folders.value.find(f => f.id === editingFolderId.value);
    if (folder) folder.name = folderNameInput.value;
    message.success('修改成功');
  } else {
    // 新建逻辑
    const newId = `f_${Date.now()}`;
    folders.value.push({
      id: newId,
      name: folderNameInput.value
    });
    message.success('新建成功');
  }
  folderModalVisible.value = false;
};

const openDeleteFolderModal = (folder) => {
  deletingFolder.value = folder;
  deleteActionType.value = 'clear'; // 默认清空
  deleteFolderModalVisible.value = true;
};

const handleDeleteFolderConfirm = () => {
  const folder = deletingFolder.value;

  if (deleteActionType.value === 'clear') {
    // 清空该文件夹下内容
    allItems.value = allItems.value.filter(item => item.folderId !== folder.id);
    message.success(`已删除 "${folder.name}" 并清空其中内容`);
  } else {
    // 移动到默认文件夹
    allItems.value.forEach(item => {
      if (item.folderId === folder.id) {
        item.folderId = 'default';
      }
    });
    message.success(`已删除 "${folder.name}"，内容已移至默认收藏夹`);
  }

  // 删除文件夹节点
  folders.value = folders.value.filter(f => f.id !== folder.id);

  // 如果删除的是当前选中的，跳回默认
  if (currentFolder.value.id === folder.id) {
    handleFolderClick(folders.value[0]);
  }

  deleteFolderModalVisible.value = false;
};

// --- 内容项操作逻辑 ---
const removeItem = (item) => {
  Modal.confirm({
    title: '确认移除?',
    content: `确定要将 "${item.title}" 移出当前收藏夹吗？`,
    okText: '移除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      allItems.value = allItems.value.filter(i => i.id !== item.id);
      message.success('已移除');
    }
  });
};
</script>

<style scoped>
/* 布局微调 */
.layout-sider {
  background: #fff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
}
.folder-operations {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.folder-list {
  flex: 1;
  overflow-y: auto;
}
.folder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 8px; /* 给操作按钮留空隙 */
}

/* 内容区域布局 */
.layout-content {
  background: #fff;
  margin: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止整个页面滚动，只让内容区滚动 */
}
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.scrollable-content {
  flex: 1;
  overflow-y: auto;
}

/* 卡片样式 */
.content-card {
  margin-bottom: 24px;
  transition: all 0.3s;
  cursor: pointer;
}
.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.card-cover {
  width: 100%;
  aspect-ratio: 16/9; /* 保持宽高比 */
  object-fit: cover;
  border-radius: 4px;
}
.card-title {
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #333;
}
.card-action {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

/* 分页区域 */
.pagination-area {
  padding: 16px 0;
  display: flex;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
}
</style>
