<script lang="ts" setup>
import CustomerResearchTable from '@/views/operate/components/customer-research-table.vue'

const router = useRouter()
const addNew = () => router.push('/customer-management/customer-form')
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div class="top-left">
          <div class="title">
            客户管理
          </div>
        </div>
        <div class="top-right">
          <el-button size="large" type="primary" @click="addNew">
            添加客户
          </el-button>
        </div>
      </div>
      <div class="bottom">
        <CustomerResearchTable />
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
