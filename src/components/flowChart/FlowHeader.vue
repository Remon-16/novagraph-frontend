<template>
  <div class="header-container">
    <div class="header-left-group">
      <a-switch
        v-model:checked="isOwner"
        checked-children="发布者视角"
        un-checked-children="访客视角"
        @change="handleRoleChange"
      />
    </div>

    <div class="header-right-group">
      <template v-if="isOwner">
        <a-radio-group
          v-model:value="localViewMode"
          button-style="solid"
          size="small"
        >
          <a-radio-button value="play">播放视图</a-radio-button>
          <a-radio-button value="split">分屏视图</a-radio-button>
          <a-radio-button value="edit">编辑视图</a-radio-button>
        </a-radio-group>
      </template>

      <a-button
        v-if="viewMode !== 'edit'"
        type="primary"
        shape="circle"
        @click="toggleAutoPlay"
      >
        <template #icon>
          <span v-if="autoPlayTimer"><PauseOutlined /></span>
          <span v-else><CaretRightOutlined /></span>
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  isOwner: boolean
  viewMode: string
  autoPlayTimer: any
}>()

const emit = defineEmits<{
  (e: 'update:isOwner', value: boolean): void
  (e: 'update:viewMode', value: string): void
  (e: 'toggleAutoPlay'): void
}>()

const isOwner = ref(props.isOwner)
const viewMode = ref(props.viewMode)
const autoPlayTimer = ref(props.autoPlayTimer)

watch(
  () => props.isOwner,
  (val) => {
    isOwner.value = val
  }
)

watch(
  () => props.viewMode,
  (val) => {
    viewMode.value = val
  }
)

watch(
  () => props.autoPlayTimer,
  (val) => {
    autoPlayTimer.value = val
  }
)

const handleRoleChange = (checked: boolean) => {
  emit('update:isOwner', checked)
  if (!checked) {
    // 访客只能播放模式
    emit('update:viewMode', 'play')
  }
}

const toggleAutoPlay = () => {
  emit('toggleAutoPlay')
}

const localViewMode = computed({
  get() {
    return props.viewMode;
  },
  set(value: string) {
    emit('update:viewMode', value);
  }
});
</script>

<style scoped>

/* 玻璃拟态效果 */
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.header-container {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 1rem;
  padding: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}


.header-left-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-right-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
