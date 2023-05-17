<script setup lang="ts">
import dayjs from 'dayjs'
import type { resTaskDataI } from '@/views/production/task-method'
import { activeTaskData, getTask } from '@/views/production/task-method'

const props = defineProps<{
  taskId: string
}>()
const loading = ref(false)
const days = ref('')
const getDetail = async () => {
  const data = await getTask(props.taskId)
  activeTaskData.value = data as resTaskDataI
  days.value = `${ dayjs(data.end_time).diff(data.start_time, 'day') }`
}
getDetail()
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <el-descriptions title="" :column="2">
        <el-descriptions-item label="科研项目名称：">
          {{ activeTaskData.project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="项目编码：">
          {{ activeTaskData.project_id }}
        </el-descriptions-item>
        <el-descriptions-item label="行业类型：">
          {{ activeTaskData.industry_type }}
        </el-descriptions-item>
        <el-descriptions-item label="项目类型：">
          {{ activeTaskData.project_type }}
        </el-descriptions-item>
        <el-descriptions-item label="专业要求：">
          {{ activeTaskData.major }}
        </el-descriptions-item>
        <el-descriptions-item label="项目起止时间：">
          {{ activeTaskData.start_time }} —— {{ activeTaskData.end_time }}
        </el-descriptions-item>
        <el-descriptions-item label="项目工期：">
          {{ days }}天
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" style="margin-top: 40px;">
        <el-descriptions-item label="任务名称：">
          {{ activeTaskData.task_name }}
        </el-descriptions-item>
        <el-descriptions-item label="任务编码：">
          {{ activeTaskData.task_code }}
        </el-descriptions-item>
        <el-descriptions-item label="主体生产机构：">
          {{ activeTaskData.main_department }}
        </el-descriptions-item>
        <el-descriptions-item label="划分产值金额比例：">
          {{ activeTaskData.allocation_ratio }}
        </el-descriptions-item>
        <el-descriptions-item label="生产负责人：">
          {{ activeTaskData.production_user }}
        </el-descriptions-item>
        <el-descriptions-item label="成果提交时间：">
          {{ activeTaskData.deadline }}
        </el-descriptions-item>
        <el-descriptions-item label="生产任务情况说明：">
          {{ activeTaskData.task_explain }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        v-for="op in activeTaskData.participating_organization" :key="op.taskCode" :column="2"
        style="margin-top: 40px;"
      >
        <el-descriptions-item label="任务名称：">
          {{ op.task_name }}
        </el-descriptions-item>
        <el-descriptions-item label="任务编码：">
          {{ op.taskCode }}
        </el-descriptions-item>
        <el-descriptions-item label="参与机构：">
          {{ op.department }}
        </el-descriptions-item>
        <el-descriptions-item label="划分产值金额比例：">
          {{ op.allocation_ratio }}
        </el-descriptions-item>
        <el-descriptions-item label="生产负责人：">
          {{ op.production_user }}
        </el-descriptions-item>
        <el-descriptions-item label="成果提交时间：">
          {{ op.deadline }}
        </el-descriptions-item>
        <el-descriptions-item label="生产任务情况说明：">
          {{ op.task_explain }}
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
