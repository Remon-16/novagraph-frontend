<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="8" v-for="user in dataSource" :key="user.id">
        <user-card
          :user="user"
          :type="type"
          @action="handleUserAction"
        />
      </a-col>
    </a-row>

    <div style="margin-top: 32px; text-align: center;">
      <a-pagination
        v-model:current="currentPage"
        :total="total"
        :page-size="pageSize"
        show-size-changer={false}
        show-quick-jumper
        @change="handlePageChange"
      />
      <div style="margin-top: 8px; color: #ccc; font-size: 12px;">
        共 {{ total }} 位用户，每页 24 位
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserCard from '@/components/UserCard.vue'
const props = defineProps({
  dataSource: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
});
const emit = defineEmits({})

const currentPage = ref(1);

const handlePageChange = (page) => {
  currentPage.value = page;
  emit('page-change', page);
  // 模拟滚动回顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleUserAction = (payload) => {
  emit('user-action', payload);
};
</script>

<style scoped>

</style>
