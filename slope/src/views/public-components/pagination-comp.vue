<script setup lang="ts">
import { pageData } from '@/views/scientific_research/project-method'

const emit = defineEmits(['pageChange'])
const handleSizeChange = (s: number) => {
  pageData.page_size = s
  emit('pageChange', s)
}
const handleCurrentChange = (n: number) => {
  pageData.page_number = n
  emit('pageChange', n)
}
</script>

<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="pageData.page_number"
      v-model:page-size="pageData.page_size"
      class="pagination"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
