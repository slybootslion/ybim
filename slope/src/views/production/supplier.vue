<script lang="ts" setup>
import SupplierResearchTable from '@/views/production/components/supplier-research-table.vue'

const router = useRouter()
const addNew = () => router.push('/supplier-management/supplier-form')
</script>

<template>
  <page-main class="page-main">
    <div class="top">
      <div class="top-left">
        <div class="title">
          供应商管理
        </div>
      </div>
      <div class="top-right">
        <el-button v-auth="['PM00202001']" size="large" type="primary" @click="addNew">
          新建供应商
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <SupplierResearchTable />
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
