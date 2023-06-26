<script setup lang="ts">
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import type { getProjectTableListI, resProjectTableItemI } from '@/views/production/project-method'
import { getProjectList, pageData, primaryIndustryTypeOptions } from '@/views/production/project-method'
import { primaryBusinessOptions } from '@/views/operate/customer-method'
import { pageI } from '@/utils/tools'

const tableLoading = ref(false)
let tableData = reactive<resProjectTableItemI[]>([])
const getList = async (param: getProjectTableListI) => {
  tableLoading.value = true
  delete param.total
  const res = await getProjectList(param)
  tableData = res.list.map((item: any) => {
    if (item.participating_organization) {
      item.children = item.participating_organization
      item.children.forEach((subItem: any) => {
        subItem.main_department = subItem.department
      })
    }
    return item
  })
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const searchData: getProjectTableListI = reactive<getProjectTableListI>({
  page_size: 0,
  page_number: 0,
  project_name: '',
  project_type: '',
  industry_type: '',
  project_dependency_country: '',
  project_dependency_province: '',
  project_dependency_city: '',
  task_name: '',
  task_code: '',
  main_department: '',
  production_user: '',
})
const pcas = ref<string[]>([])
const pageChange = () => {
  const data: getProjectTableListI = { ...pageData }
  if (searchData.project_name) data.project_name = searchData.project_name
  if (searchData.project_type) data.project_type = searchData.project_type
  if (searchData.project_dependency_country === '国外') data.project_dependency_country = searchData.project_dependency_country
  if (searchData.task_name) data.task_name = searchData.task_name
  if (searchData.task_code) data.task_code = searchData.task_code
  if (searchData.main_department) data.main_department = searchData.main_department
  if (searchData.production_user) data.production_user = searchData.production_user
  if (pcas.value && pcas.value.length) {
    data.project_dependency_province = pcas.value[0]
    data.project_dependency_city = pcas.value[1]
  }
  getList(data)
}
const router = useRouter()
const researchNameClick = (row: resProjectTableItemI) => {
  router.push(`/production-management/task-detail?task_id=${row.task_id}`)
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
      <el-form-item label="任务名称：">
        <el-input v-model="searchData.task_name" clearable />
      </el-form-item>
      <el-form-item label="任务编码：">
        <el-input v-model="searchData.task_code" clearable />
      </el-form-item>
      <el-form-item label="生产机构：">
        <el-input v-model="searchData.main_department" clearable />
      </el-form-item>
      <el-form-item label="生产负责人：">
        <el-input v-model="searchData.production_user" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table
    v-loading="tableLoading" :data="tableData" row-key="task_code" border default-expand-all
    style="width: 100%"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="序号" type="index" width="50" />
    <el-table-column label="项目名称" min-width="230">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row)">
          {{ scope.row.project_name }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column property="project_code" label="项目编码" width="160" />
    <el-table-column property="project_type" label="项目类型" width="230" />
    <el-table-column label="项目属地" width="130">
      <template #default="scope">
        {{
          scope.row.project_dependency_country === '国内'
            ? `${scope.row.project_dependency_province} ${scope.row.project_dependency_city}`
            : scope.row.project_dependency_country
        }}
      </template>
    </el-table-column>
    <el-table-column property="task_name" label="任务名称" width="160" />
    <el-table-column property="task_code" label="任务编码" width="160" />
    <el-table-column property="main_department" label="生产机构" width="130" />
    <el-table-column property="production_user" label="生产负责人" width="100" />
    <el-table-column property="registrant_user" label="经办人" width="100" />
  </el-table>
  <PaginationComp :page-data="pageData as pageI" @page-change="pageChange" />
</template>

<style scoped lang="scss">
.search-box {
  :deep(.el-form-item__content) {
    width: 150px !important;
  }
}

.pagination {
  margin-top: 10px;
}
</style>
