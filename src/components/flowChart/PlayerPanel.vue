<template>
  <div>
    <div v-if="showHeader" class="panel-header">
      <span class="status-dot-green"></span>
      用户预览视角
    </div>

    <div class="panel-body">
      <img :src="currentNodeData.imageUrl" class="media-content" alt="Preview" />
      <div class="media-overlay">
        <h3 class="text-bold">{{ displayText }}</h3>
        <a-button
          class="control-btn"
          shape="circle"
          @click="togglePlay"
        >
          <template #icon>
            <span v-if="isPlaying"><PauseOutlined /></span>
            <span v-else><CaretRightOutlined /></span>
          </template>
        </a-button>
      </div>
    </div>

    <!-- 控制区 -->
    <div class="content-wrapper">
      <!-- 分支选择 -->
      <div v-if="branchOptions.length > 0" class="mb-4">
        <p class="section-title">请选择下一步操作：</p>
        <div class="button-group">
          <a-button
            v-for="branch in branchOptions"
            :key="branch.id"
            type="primary"
            size="large"
            shape="round"
            @click="selectBranch(branch.id)"
          >
            {{ branch.text }}
          </a-button>
        </div>
      </div>

      <!-- 线性流程下一步 -->
      <div v-else class="centered-flex">
        <a-button
          type="primary"
          size="large"
          shape="round"
          :disabled="isFinished"
          @click="nextStep"
        >
          {{ isFinished ? '流程已结束' : '下一步' }}
          <template #icon>
            <span class="ml-2">→</span>
          </template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onUnmounted, ref } from 'vue'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  currentNodeData: {
    id: string
    label: string
    imageUrl: string
    properties: string[]
  }
  branchOptions: { id: string; text: string }[]
  isFinished: boolean
  showHeader?: boolean
}>()

const emit = defineEmits<{
  (e: 'selectBranch', targetId: string): void
  (e: 'nextStep'): void
}>()

const selectBranch = (targetId: string) => {
  emit('selectBranch', targetId)
}

const nextStep = () => {
  emit('nextStep')
}

const speed = ref<number>(100); // 打字速度（毫秒/字）
const displayText = ref<string>(''); // 当前显示的文本
const currentIndex = ref<number>(0); // 当前打字到了第几个字
const isPlaying = ref<boolean>(false); // 是否正在播放


let timer: ReturnType<typeof setInterval> | null = null;

const breakPunctuations = ['。', '！', '？', '…', '.', '!', '?'];
const pauseTime = 650;

const playNextChar = () => {
  // 如果暂停了，直接停止
  if (!isPlaying.value) return;

  // 如果已经播完了，停止
  if (currentIndex.value >= props.currentNodeData.label.length) {
    stopPlay();
    return;
  }

  // 1. 获取当前字符并追加
  const currentChar = props.currentNodeData.label[currentIndex.value];
  displayText.value += currentChar;
  currentIndex.value++;

  // 2. 判断当前字符是否为句末标点
  if (breakPunctuations.includes(currentChar) || displayText.value.length > 25) {
    // 先停顿 150ms，然后再清空并继续
    timer = setTimeout(() => {
      displayText.value = '';

      while (currentIndex.value < props.currentNodeData.label.length) {
        const nextChar = props.currentNodeData.label[currentIndex.value];
        if (nextChar === ' ' || nextChar === '\n') {
          currentIndex.value++;
        } else {
          break;
        }
      }

      playNextChar();
    }, pauseTime);

  } else {
    // 3. 如果是普通字符，正常间隔 speed 毫秒后打下一个字
    timer = setTimeout(playNextChar, speed.value);
  }
};

const startPlay = () => {
  if (currentIndex.value >= props.currentNodeData.label.length) {
    resetText();
  }
  isPlaying.value = true;
  playNextChar();
};

// 暂停播放
const stopPlay = () => {
  isPlaying.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 切换播放/暂停
const togglePlay = () => {
  if (isPlaying.value) {
    stopPlay();
  } else {
    startPlay();
  }
};

// 重置
const resetText = () => {
  stopPlay();
  displayText.value = '';
  currentIndex.value = 0;
};

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>

/* 玻璃拟态效果 */
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.content-wrapper {
  padding: 1.5rem; /* p-6 */
  background-color: rgba(255, 255, 255, 0.4);
}

.section-title {
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-align: center;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.centered-flex {
  display: flex;
  justify-content: center;
}

.panel-container {
  width: 50%;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.panel-header {
  padding: 0.75rem;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(229, 231, 235, 0.5);
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: #4b5563;
  display: flex;
  align-items: center;
}

.status-dot-green {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #22c55e;
  margin-right: 0.5rem;
}

.panel-body {
  flex: 1 1 0%;
  position: relative;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  height: 80px;
  box-sizing: border-box;

  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.text-bold {
  font-weight: 700;
  margin: 0 40px 0 0;
}

.control-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

</style>
