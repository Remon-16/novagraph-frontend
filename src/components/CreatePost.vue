<template>
  <div class="card post-editor">
    <a-textarea
      v-model:value="content"
      :rows="3"
      placeholder="分享你的新鲜事..."
      @input="handleInput"
    />
    <div class="editor-actions">
      <a-space style="gap: 15px;">
        <a-tooltip title="上传图片">
          <PictureOutlined style="font-size: 17px;" type="text" shape="circle"  @click="mockUpload" />
        </a-tooltip>
        <a-tooltip title="艾特好友">
          <a-button class="custom-icon-btn"
                    type="text" shape="circle" @click="insertAt">@</a-button>
        </a-tooltip>
        <a-tooltip title="插入表情">
          <SmileOutlined style="font-size: 17px;" type="text" shape="circle" @click="insertEmoji" />
        </a-tooltip>
      </a-space>
      <a-button type="primary" size="small" :disabled="!content.trim()" @click="submit">发布</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PictureOutlined,
  SmileOutlined
} from '@ant-design/icons-vue'
import { h, ref } from 'vue'
import { message } from 'ant-design-vue'

const icons = window['icons']; // 从全局获取（见下方代码）
const content = ref('');

const emit = defineEmits({})

const handleInput = () => {
  // 简单的字数统计或其他逻辑
};

const mockUpload = () => {
  message.info("模拟选择图片文件...");
};

const insertAt = () => {
  content.value += '@';
};

const insertEmoji = () => {
  content.value += '/doge ';
  message.success("已插入 /doge");
};

const submit = () => {
  if (!content.value.trim()) return;
  emit('post-submit', content.value);
  content.value = '';
  message.success("发布成功！");
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

/* 编辑器 */
.post-editor {
  margin-bottom: 16px;
}
.editor-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.action-btn.liked span {
  font-weight: bold;
}
.custom-icon-btn {
  font-size: 18px;
  font-weight: 600;
  height: auto;
  width: auto;
  min-width: auto;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: none;
}

.custom-icon-btn:hover,
.custom-icon-btn:focus {
  background: transparent !important;
  color: inherit;
  box-shadow: none !important;
}
</style>
