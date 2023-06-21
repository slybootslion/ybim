<script setup lang="ts">
import type { pageI } from '@/utils/tools'

const props = defineProps<{
  pageData: pageI
}>()

const emit = defineEmits(['pageChange'])
const total = ref(0)
watchEffect(() => {
  total.value = props.pageData.total ? props.pageData.total : 0
})

const handleSizeChange = (s: number) => {
  props!.pageData.page_size = s
  emit('pageChange', s)
}
const handleCurrentChange = (n: number) => {
  props!.pageData.page_number = n
  emit('pageChange', n)
}
</script>

<template>
  <div class="pagination">
    <el-pagination
      v-model:current-page="pageData!.page_number"
      v-model:page-size="pageData!.page_size"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
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
