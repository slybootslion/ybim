<script lang="ts" setup>
import RecordResearchTable from '@/views/operate/components/record-research-table.vue'

const router = useRouter()
const addNew = () => router.push('/record-management/record-form')
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div class="top-left">
          <div class="title">
            备案管理
          </div>
        </div>
        <div class="top-right">
          <el-button size="large" type="primary" @click="addNew">
            新建备案
          </el-button>
        </div>
      </div>
      <div class="bottom">
        <RecordResearchTable />
      </div>
    </page-main>
  </div>
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
