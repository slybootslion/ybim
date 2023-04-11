<script setup lang="ts">
import type { getProjectListParamI, resProjectListI } from '@/views/scientific_research/project-method'
import { getProjectList, pageData } from '@/views/scientific_research/project-method'
import PaginationComp from '@/views/public-components/pagination-comp.vue'

const tableLoading = ref(false)
const tableData = ref<resProjectListI[]>([])
const getList = async (otherParam: getProjectListParamI) => {
  tableLoading.value = true
  const res = await getProjectList(otherParam)
  tableData.value = res.list as resProjectListI[]
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const pageChange = () => {
  getList(pageData)
}
</script>

<template>
  <div class="search-box">
    search-box
  </div>
  <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
    <el-table-column label="序号" type="index" width="50" />
    <el-table-column property="initiation_year" label="立项年度" width="110" />
    <el-table-column property="research_name" label="项目名称" />
    <el-table-column property="research_type" label="项目类别" width="130" />
    <el-table-column property="research_code" label="项目编码" width="220" />
    <el-table-column property="status" label="项目执行状态" width="120" />
    <el-table-column property="registrant_user" label="登记人员" width="140" />
    <el-table-column property="create_time" label="登记时间" width="170" />
  </el-table>
  <PaginationComp @current-change="pageChange" @size-change="pageChange" />
</template>

<style lang="scss">
.pagination {
  margin-top: 10px;
}
</style>
