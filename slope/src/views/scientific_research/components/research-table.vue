<script setup lang="ts">
import type { getProjectListParamI, resProjectListI } from '@/views/scientific_research/project-method'
import { getProjectList, pageData, researchNameClick } from '@/views/scientific_research/project-method'
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
const pcas = ref<string[]>([])

interface searchI {
  research_name: string
  status: string
  research_code: string
  research_type: string
  registrant_user: string
}

const searchData: Record<string, string> = reactive<searchI>({
  research_name: '',
  status: '',
  research_code: '',
  research_type: '',
  registrant_user: '',
})
const pageChange = () => {
  const data: getProjectListParamI = { ...pageData }
  if (searchData.research_name) data.research_name = searchData.research_name
  if (searchData.status) data.status = +searchData.status
  if (searchData.research_code) data.research_code = searchData.research_code
  if (searchData.research_type) data.research_type = searchData.research_type
  if (searchData.registrant_user) data.registrant_user = searchData.registrant_user
  if (pcas.value && pcas.value.length) {
    data.project_dependency_province = pcas.value[0]
    data.project_dependency_city = pcas.value[1]
  }
  delete data.total
  getList(data)
}
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <el-form-item label="项目名称：">
        <el-input v-model="searchData.research_name" clearable />
      </el-form-item>
      <el-form-item label="项目编码：">
        <el-input v-model="searchData.research_code" clearable />
      </el-form-item>
      <el-form-item label="项目类别：">
        <el-select v-model="searchData.research_type" clearable>
          <el-option label="科研课题" value="科研课题" />
          <el-option label="标准项目" value="标准项目" />
        </el-select>
      </el-form-item>
      <el-form-item label="地区：">
        <pcas-cascader v-model="pcas" type="pc" format="name" />
      </el-form-item>
      <el-form-item label="项目状态：">
        <el-select v-model="searchData.status" clearable>
          <el-option label="立项" value="1" />
          <el-option label="执行中" value="2" />
          <el-option label="完结" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="登记人员：">
        <el-input v-model="searchData.registrant_user" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
    <el-table-column label="序号" type="index" width="50" />
    <el-table-column property="initiation_year" label="立项年度" width="110" />
    <el-table-column label="项目名称">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row)">
          {{ scope.row.research_name }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column property="research_type" label="项目类别" width="130" />
    <el-table-column property="research_code" label="项目编码" width="220" />
    <el-table-column property="status" label="项目执行状态" width="120" />
    <el-table-column property="registrant_user" label="登记人员" width="140" />
    <el-table-column property="create_time" label="登记时间" width="170" />
  </el-table>
  <PaginationComp @page-change="pageChange" />
</template>

<style lang="scss" scoped>
.search-box {
  :deep(.el-form-item__content) {
    width: 220px !important;
  }
}
.pagination {
  margin-top: 10px;
}
</style>
