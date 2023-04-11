<script setup lang="ts">
import { addNew } from '@/views/scientific_research/project-method'
import ResearchTable from '@/views/scientific_research/components/research-table.vue'
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div class="top-left">
          <div class="title">
            科研项目信息
          </div>
        </div>
        <div class="top-right">
          <el-button size="large" type="primary" @click="addNew">
            科研项目登记
          </el-button>
        </div>
      </div>
      <div class="bottom">
        <ResearchTable />
      </div>
    </page-main>
  </div>
</template>

<style lang="scss">
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
