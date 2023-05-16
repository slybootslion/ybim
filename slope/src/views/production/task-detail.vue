<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { back } from '@/views/scientific_research/project-method'
import TaskTab1 from '@/views/production/components/task-tab1.vue'
import TaskTab2 from '@/views/production/components/task-tab2.vue'

const route = useRoute()
const router = useRouter()
const query = route.query
const taskId = ref('')
if (!query.task_id) {
  ElMessage.error('任务id不正确')
  router.push('/production-management/production-list')
} else {
  taskId.value = query.task_id as string
}
const activeName = ref('基本信息')
</script>

<template>
  <page-main class="page-main">
    <div class="top">
      <div>
        项目信息
      </div>
      <div>
        <el-button type="primary">
          项目完结
        </el-button>
        <el-button @click="back">
          返回
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="基本信息">
          <TaskTab1 :task-id="taskId as string" />
        </el-tab-pane>
        <el-tab-pane label="生产资料" name="生产资料">
          <TaskTab2 :task-id="taskId as string" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </page-main>
</template>

<style scoped lang="scss">
.page-main {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
