<script lang="ts" setup>
import ProjectResearchTable from '@/views/production/components/project-research-table.vue'

const router = useRouter()
const addNew = () => router.push('/task-order/task')
</script>

<template>
  <page-main class="page-main">
    <div class="top">
      <div class="top-left">
        <div class="title">
          生产项目管理
        </div>
      </div>
      <div class="top-right">
        <el-button v-auth="['PM00201001']" size="large" type="primary" @click="addNew">
          生产任务下单
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <ProjectResearchTable />
    </div>
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  .top {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-left {
      font-size: 18px;
    }
  }
}
</style>
