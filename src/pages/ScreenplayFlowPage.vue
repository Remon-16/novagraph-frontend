<template>
  <div>
    <FlowHeader
      v-model:isOwner="isOwner"
      v-model:viewMode="viewMode"
      v-model:autoPlayTimer="autoPlayTimer"
      @toggle-auto-play="toggleAutoPlay"
    />
  </div>

  <!-- 模式1: 纯播放模式 (访客 或 发布者选择播放视图) -->
  <div v-if="viewMode === 'play'" class="page-center-wrapper">
    <div class="glass-panel-container">
      <PlayerPanel
        :current-node-data="currentNodeData"
        :branch-options="branchOptions"
        :is-finished="isFinished"
        :show-header="false"
        @select-branch="selectBranch"
        @next-step="nextStep"
      />
    </div>
  </div>

  <!-- 模式2: 分屏模式 (左侧播放，右侧编辑) -->
  <div v-if="viewMode === 'split'" class="main-split-container">
    <!-- 左侧：用户视角播放器 -->
    <div class="panel-container">
      <PlayerPanel
        :current-node-data="currentNodeData"
        :branch-options="branchOptions"
        :is-finished="isFinished"
        :show-header="true"
        @select-branch="selectBranch"
        @next-step="nextStep"
      />
    </div>

    <!-- 右侧：开发者编辑器 -->
    <div class="half-width-panel">
      <div class="panel-header-space-between">
        <div class="flex-center">
          <span class="status-dot-blue"></span>
          开发者编辑视角
        </div>
        <a-button size="small" type="link">保存修改</a-button>
      </div>
      <div id="split-target" class="graph-area"></div>
    </div>
  </div>

  <!-- 模式3: 纯编辑模式 -->
  <div v-if="viewMode === 'edit'" class="full-height-panel">
    <div class="flex-center">
      <span class="status-dot-blue"></span>
      流程编辑模式
    </div>
    <div>
      <div id="edit-target" class="graph-area"></div>
    </div>
  </div>

  <Teleport :to="teleportTarget" :disabled="viewMode === 'play'">
    <FlowEditorContainer
      ref="editorRef"
      :view-mode="viewMode"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FlowHeader from '@/components/flowChart/FlowHeader.vue'
import PlayerPanel from '@/components/flowChart/PlayerPanel.vue'
import FlowEditorContainer from '@/components/flowChart/FlowEditorContainer.vue'
import { message } from 'ant-design-vue'

const isOwner = ref(true)
const viewMode = ref('play')
const autoPlayTimer = ref(null)
const branchOptions = ref([])
const isFinished = ref(false)
const currentNodeId = ref('de3fd8c0-9766-4d96-826f-a20fda70ee77')
const editorRef = ref<InstanceType<typeof FlowEditorContainer>>()

const teleportTarget = computed(() => {
  if (viewMode.value === 'split') return '#split-target'
  if (viewMode.value === 'edit') return '#edit-target'
  return 'body'
})

// 计算 graph 实例（通过子组件的 ref）
const graph = computed(() => editorRef.value?.graph)

// 计算属性：当前节点数据
const currentNodeData = computed(() => {
  if (!graph.value) return { label: '加载中...', properties: [], imageUrl: '' }
  const node = graph.value.getCellById(currentNodeId.value)
  if (!node) return { label: '未知节点', properties: [], imageUrl: '' }

  const data = node.getData() || {}
  return {
    id: node.id,
    label: data.label || node.attr('text/text') || '未命名',
    imageUrl: data.imageUrl || 'https://via.placeholder.com/800x450?text=No+Image',
    properties: data.properties || [],
  }
})

// 角色切换
const handleRoleChange = (checked: boolean) => {
  if (!checked) {
    viewMode.value = 'play'
  }
}

// 自动播放控制
const toggleAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
    message.success('自动播放已暂停')
  } else {
    autoPlayTimer.value = setInterval(() => {
      if (isFinished.value) {
        clearInterval(autoPlayTimer.value)
        autoPlayTimer.value = null
        return
      }
      if (branchOptions.value.length === 0) {
        nextStep()
      }
    }, 3000)
    message.success('自动播放已开始 (3秒/步)')
  }
}

// 选择分支
const selectBranch = (targetId: string) => {
  moveToNode(targetId)
}

// 移动到指定节点
const moveToNode = (nodeId: string) => {
  currentNodeId.value = nodeId
  updateBranchOptions()
}

// 更新分支选项
const updateBranchOptions = () => {
  if (!graph.value) return
  const currentNode = graph.value.getCellById(currentNodeId.value)
  if (!currentNode || !currentNode.isNode()) {
    branchOptions.value = []
    return
  }

  const outgoingEdges = graph.value.getOutgoingEdges(currentNode)
  if (!outgoingEdges || outgoingEdges.length === 0) {
    isFinished.value = true
    branchOptions.value = []
    return
  }
  isFinished.value = false

  if (outgoingEdges.length > 1) {
    const branchConditions = currentNode.getData()?.branchConditions
    if (branchConditions) {
      branchOptions.value = Object.entries(branchConditions).map(([targetId, text]) => ({
        id: targetId,
        text: text,
      }))
    } else {
      branchOptions.value = outgoingEdges.map((edge) => {
        const target = edge.getTargetNode()
        return { id: target.id, text: `前往: ${target.getData()?.label || target.id}` }
      })
    }
  } else {
    branchOptions.value = []
  }
}

// 下一步
const nextStep = () => {
  if (isFinished.value) {
    message.info('流程已结束')
    return
  }

  const currentNode = graph.value?.getCellById(currentNodeId.value)
  const outgoingEdges = graph.value?.getOutgoingEdges(currentNode)

  if (outgoingEdges.length > 1) {
    message.warning('请点击按钮选择具体的分支路径')
    return
  }

  const nextNode = outgoingEdges[0].getTargetNode()
  if (nextNode) {
    moveToNode(nextNode.id)
  }
}
</script>

<style scoped>

.glass-panel-container {
  width: 100%;
  max-width: 56rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  transition: all 0.5s ease;
}

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

.main-split-container {
  display: flex;
  gap: 1rem;
  height: calc(100vh - 8rem);
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
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.text-bold {
  font-weight: 700;
}

.panel-header-space-between {
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
  justify-content: space-between;
}

.flex-center {
  display: flex;
  align-items: center;
}

.status-dot-blue {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #3b82f6;
  margin-right: 0.5rem;
}

.page-center-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 8rem);
}

.half-width-panel {
  width: 50%;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.full-height-panel {
  height: calc(100vh - 8rem);
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.x6-wrapper {
  width: 100%;
  height: 600px;
  position: relative;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  transition: opacity 0.3s;
}

.x6-hidden {
  position: absolute !important;
  top: 0;
  left: 0;
  z-index: -1;
  visibility: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}
</style>
