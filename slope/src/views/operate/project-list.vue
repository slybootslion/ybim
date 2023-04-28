<script lang="ts" setup>
import ProjectResearchTable from '@/views/operate/components/project-research-table.vue'

const handoverProject = () => {
  console.log('----')
}
const addNew = () => console.log('addNew')
</script>

<template>
  <page-main class="page-main">
    <div class="top">
      <div class="top-left">
        <div class="title">
          立项项目管理
        </div>
      </div>
      <div class="top-right">
        <el-button size="large" @click="handoverProject">
          项目转让/移交
        </el-button>
        <el-button size="large" type="primary" @click="addNew">
          项目备案立项
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
