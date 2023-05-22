<script setup lang="ts">
import QualificationResearchTable from '@/views/achievement/components/qualification-research-table.vue'

const router = useRouter()
const addNew = () => router.push('/achievement-qualification/qualification-form')
</script>

<template>
  <page-main class="page-main">
    <div class="top">
      <div class="top-left">
        <div class="title">
          资质管理
        </div>
      </div>
      <div class="top-right">
        <el-button size="large" type="primary" @click="addNew">
          新建资质
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <QualificationResearchTable />
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
