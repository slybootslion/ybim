<script setup lang="ts">
import type { resTaskDataI } from '@/views/production/task-method'
import { activeTaskData, getTask } from '@/views/production/task-method'

const props = defineProps<{
  taskId: string
}>()
const loading = ref(false)
const getDetail = async () => {
  const data = await getTask(props.taskId)
  activeTaskData.value = data as resTaskDataI
}
getDetail()
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="科研项目名称：">
          {{ activeTaskData.project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="项目编码：">
          {{ activeTaskData.project_id }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style scoped lang="scss">
.block {
  margin-top: 10px;
  :deep(.el-descriptions__body) {
    padding: 0 20px;
    white-space: pre-wrap;
  }
}
.block-text {
  :deep(.el-descriptions__cell) {
    display: flex;
    .el-descriptions__label {
      width: 100px;
    }
    .el-descriptions__content {
      flex: 1;
    }
  }
}
</style>
