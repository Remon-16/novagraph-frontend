<template>
  <div class="filter-section">
    <!-- 第一行：分类 (单选) -->
    <div class="filter-row">
      <span class="filter-label">分类:</span>
      <a-radio-group
        :value="currentCategory"
        button-style="solid"
        @change="(e) => $emit('update:currentCategory', e.target.value)"
      >
        <a-radio-button value="">全部</a-radio-button>
        <a-radio-button v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </a-radio-button>
      </a-radio-group>
    </div>

    <!-- 第二行：标签 (多选) -->
    <div class="filter-row">
      <span class="filter-label">标签:</span>
      <div>
        <a-tag
          v-for="tag in tags"
          :key="tag"
          :color="selectedTags.includes(tag) ? 'blue' : 'default'"
          style="cursor:pointer; margin-bottom:8px;"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </a-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  currentCategory: {
    type: String,
    required: true,
  },
  selectedTags:{
    type: Array,
    required: true,
  }
})

const emit = defineEmits({})

const toggleTag = (tag) => {
  const newTags = [...props.selectedTags];
  const index = newTags.indexOf(tag);
  if (index > -1) {
    newTags.splice(index, 1);
  } else {
    newTags.push(tag);
  }
  emit('update:selectedTags', newTags);
}
</script>

<style scoped>
/* CategoryFilter 组件样式 */
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-weight: 500;
  color: #333;
  min-width: 40px;
}
</style>
