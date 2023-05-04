<script lang="ts" setup>
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import type { getProjectListParamI, resProjectListI } from '@/views/operate/project-method'
import { getProjectList, pageData } from '@/views/operate/project-method'

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
  console.log('pageChange')
}

const researchNameClick = (row: resProjectListI) => {
  console.log('researchNameClick', row)
}
</script>

<template>
  <div class="search-box">
    search-box
  </div>
  <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column label="序号" type="index" width="50" />
    <el-table-column label="项目名称">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row)">
          {{ scope.row.project_code }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column property="project_code" label="项目编码" width="140" />
    <el-table-column property="industry_type" label="行业类型" width="120" />
    <el-table-column property="project_type" label="项目类型" width="120" />
    <el-table-column property="proprietor_customer" label="业主/甲方" width="130" />
    <el-table-column label="项目属地" width="130">
      <template #default="scope">
        {{ scope.row.project_dependency_province }} {{ scope.row.project_dependency_city }}
      </template>
    </el-table-column>
    <el-table-column label="项目标的" width="100">
      <template #default="scope">
        {{ scope.row.expect_amount }}万元
      </template>
    </el-table-column>
    <el-table-column property="project_status_name" label="项目状态" width="110" />
    <el-table-column property="operation_user" label="经营负责人" width="100" />
    <el-table-column property="production_user" label="生产负责人" width="100" />
    <el-table-column property="registrant_user" label="备案人员" width="100" />
    <el-table-column property="registration_time" label="备案登记时间" width="120" />
  </el-table>
  <PaginationComp @page-change="pageChange" />
</template>

<style scoped lang="scss">
.search-box {
  :deep(.el-form-item__content) {
    width: 220px !important;
  }
}
.pagination {
  margin-top: 10px;
}
</style>
