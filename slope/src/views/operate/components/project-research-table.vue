<script lang="ts" setup>
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import type { getProjectListParamI, resProjectListI } from '@/views/operate/project-method'
import { getProjectList, pageData, projectStatusOptions } from '@/views/operate/project-method'
import { primaryIndustryTypeOptions } from '@/views/production/project-method'
import { primaryBusinessOptions } from '@/views/operate/customer-method'

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
const searchData: getProjectListParamI = reactive<getProjectListParamI>({
  page_number: 0,
  page_size: 0,
})
const pcas = ref<string[]>([])
const pageChange = () => {
  const data: getProjectListParamI = { ...pageData }
  if (searchData.project_name) data.project_name = searchData.project_name
  if (searchData.project_code) data.project_code = searchData.project_code
  if (searchData.project_type) data.project_type = searchData.project_type
  if (searchData.project_dependency_country === '国外') data.project_dependency_country = searchData.project_dependency_country
  if (searchData.industry_type) data.industry_type = searchData.industry_type
  if (searchData.operation_user) data.operation_user = searchData.operation_user
  if (searchData.production_user) data.production_user = searchData.production_user
  if (searchData.project_status) data.project_status = searchData.project_status
  if (pcas.value && pcas.value.length) {
    data.project_dependency_province = pcas.value[0]
    data.project_dependency_city = pcas.value[1]
  }
  getList(data)
}
const router = useRouter()
const researchNameClick = (row: resProjectListI) => router.push(`/project-initiation/project-detail?project_id=${row.project_id}`)
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <el-form-item label="项目名称：">
        <el-input v-model="searchData.project_name" clearable />
      </el-form-item>
      <el-form-item label="国家：">
        <el-select v-model="searchData.project_dependency_country" clearable>
          <el-option label="国内" value="国内" />
          <el-option label="国外" value="国外" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="searchData.project_dependency_country === '国内'" label="地区：">
        <pcas-cascader v-model="pcas" type="pc" format="name" />
      </el-form-item>
      <el-form-item label="行业类型：">
        <el-select v-model="searchData.industry_type" clearable>
          <el-option v-for="ind in primaryIndustryTypeOptions" :key="ind" :label="ind" :value="ind" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型：">
        <el-select v-model="searchData.project_type">
          <el-option v-for="bus in primaryBusinessOptions" :key="bus" :label="bus" :value="bus" />
        </el-select>
      </el-form-item>
      <el-form-item label="经营负责人：">
        <el-input v-model="searchData.operation_user" clearable />
      </el-form-item>
      <el-form-item label="任务编码：">
        <el-input v-model="searchData.production_user" clearable />
      </el-form-item>
      <el-form-item label="项目状态：">
        <el-select v-model="searchData.project_status" clearable>
          <el-option v-for="(key, val) in projectStatusOptions" :key="val" :label="key" :value="val" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
    <el-table-column type="selection" width="50" />
    <el-table-column label="序号" type="index" width="55" />
    <el-table-column label="项目名称">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row)">
          {{ scope.row.project_name }}
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
