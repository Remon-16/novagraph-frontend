<template>
  <a-card hoverable class="image-card" :body-style="{ padding: 0 }">
    <div class="card-cover">
      <img :alt="title" :src="imageUrl" loading="lazy" />
    </div>
    <div class="card-meta">
      <div class="card-title" :title="title">{{ title }}</div>
      <div class="card-tags">
        <a-tag v-for="tag in tags" :key="tag" color="blue">{{ tag }}</a-tag>
      </div>
      <div style="margin-top:8px; color:#999; font-size:12px;">
        <i class="ri-eye-line"></i> {{ views }}
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
const props = defineProps({
  title:{
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  }
})
</script>

<style scoped>
.image-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-cover {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-card:hover .card-cover img {
  transform: scale(1.05);
}

.card-meta {
  padding: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-tags .ant-tag {
  margin-bottom: 4px;
}

</style>
