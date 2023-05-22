<script setup lang="ts">
import KnowledgeResearchTable from '@/views/achievement/components/knowledge-research-table.vue'

const router = useRouter()
const addNew = () => {}
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div class="top-left">
          <div class="title">
            知识产权信息管理
          </div>
        </div>
        <div class="top-right">
          <el-button size="large" type="primary" @click="addNew">
            新建
          </el-button>
        </div>
      </div>
      <div class="bottom">
        <KnowledgeResearchTable />
      </div>
    </page-main>
  </div>
</template>

<style scoped lang="scss">
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
