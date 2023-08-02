<script setup lang="ts">
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import type { getProjectTableListI } from '@/views/production/project-method'
import { getProjectList, pageData, primaryIndustryTypeOptions, resProjectTableItemI } from '@/views/production/project-method'
import { primaryBusinessOptions } from '@/views/operate/customer-method'
import { pageI } from '@/utils/tools'

const tableLoading = ref(false)
let tableData = reactive<resProjectTableItemI[]>([])
const getList = async (param: getProjectTableListI) => {
  tableLoading.value = true
  delete param.total
  const res = await getProjectList(param)
  tableData = res.list.map((item: any) => {
    item.children = []
    if (item.participating_organization) {
      item.children = item.participating_organization
      item.children.forEach((subItem: any) => {
        subItem.main_department = subItem.department
      })
    }
    item.children.unshift({
      task_name: item.task_name,
      task_code: item.task_code,
      main_department: item.main_department,
      production_user: item.production_user,
      allocation_ratio: item.allocation_ratio,
      deadline: item.deadline,
    })
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
  <table id="task-table" v-loading="tableLoading" class="task-table">
    <thead id="task-table-thead">
      <tr>
        <th style="width:auto;">
          任务名称
        </th>
        <th style="width:auto;">
          任务编码
        </th>
        <th style="width:auto;">
          生产机构
        </th>
        <th style="width:auto;">
          生产负责人
        </th>
        <th style="width:auto;">
          划分产值金额比例
        </th>
        <th style="width:auto;">
          成果提交时间
        </th>
      </tr>
    </thead>
    <tbody v-for="tableItem in (tableData as resProjectTableItemI[])" :key="tableItem.task_id">
      <tr class="flow-row">
        <td colspan="6" />
      </tr>
      <tr class="flow-project-i">
        <td colspan="6">
          <div class="clearfix">
            <div class="project-basic fl clearfix">
              <div class="txt-overflow">
                <span class="task-order ival" @click="researchNameClick(tableItem)">
                  {{ tableItem.project_name }}
                  <el-icon style="position:relative; top: 2px"><svg-icon name="ep:arrow-right" /></el-icon>
                </span>
                <span class="ival"><span style="color: #333;">项目类型：</span>{{ tableItem.project_type }}</span>
                <span class="ival"><span style="color: #333;">项目属地：</span>          {{
                  tableItem.project_dependency_country === '国内'
                    ? `${tableItem.project_dependency_province} ${tableItem.project_dependency_city}`
                    : tableItem.project_dependency_country
                }} </span>
                <span class="ival"><span style="color: #333;">经办人：</span>{{ tableItem.registrant_user }}</span>
                <span class="ival"><span style="color: #333;">发布时间：</span>{{ tableItem.create_time }}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr v-for="(subItem, idx) in tableItem.children" :key="idx" class="tr-bd">
        <td>{{ subItem.task_name }}</td>
        <td>{{ subItem.task_code }}</td>
        <td>{{ subItem.main_department }}</td>
        <td>{{ subItem.production_user }}</td>
        <td>{{ subItem.allocation_ratio }}</td>
        <td>{{ subItem.deadline }}</td>
      </tr>
    </tbody>
  </table>

  <!--  <el-table -->
  <!--    v-loading="tableLoading" :data="tableData" row-key="task_code" border default-expand-all -->
  <!--    style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle" -->
  <!--  > -->
  <!--    &lt;!&ndash;    <el-table-column type="selection" width="55" /> &ndash;&gt; -->
  <!--    <el-table-column label="序号" type="index" width="60" /> -->
  <!--    <el-table-column label="项目名称" min-width="230"> -->
  <!--      <template #default="scope"> -->
  <!--        <el-button link type="primary" @click="researchNameClick(scope.row)"> -->
  <!--          {{ scope.row.project_name }} -->
  <!--        </el-button> -->
  <!--      </template> -->
  <!--    </el-table-column> -->
  <!--    <el-table-column property="project_code" label="项目编码" width="160" /> -->
  <!--    <el-table-column property="project_type" label="项目类型" width="230" /> -->
  <!--    <el-table-column label="项目属地" width="130"> -->
  <!--      <template #default="scope"> -->
  <!--          {{ -->
  <!--            scope.row.project_dependency_country === '国内' -->
  <!--              ? `${scope.row.project_dependency_province} ${scope.row.project_dependency_city}` -->
  <!--              : scope.row.project_dependency_country -->
  <!--          }} -->
  <!--      </template> -->
  <!--    </el-table-column> -->
  <!--    <el-table-column property="task_name" label="任务名称" width="160" /> -->
  <!--    <el-table-column property="task_code" label="任务编码" width="160" /> -->
  <!--    <el-table-column property="main_department" label="生产机构" width="130" /> -->
  <!--    <el-table-column property="production_user" label="生产负责人" width="100" /> -->
  <!--    <el-table-column property="registrant_user" label="经办人" width="100" /> -->
  <!--  </el-table> -->
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

.task-table {
  width: 99.99%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
}

.task-table th {
  height: 42px;
  text-align: center;
  background-color: #e9f2f5;
  color: #004da5;
}

.task-table tbody {

}

.task-table tbody:hover .over-project {
  display: block;
}

.flow-row {
  height: 12px;
}

.flow-row td {
  border: 0 !important;
}

.flow-project-i > td {
  padding: 10px 14px;
  border-bottom-color: #d5d5d5 !important;
  background-color: #f1f1f1;
  text-align: left !important;
}

.task-table tbody td,
.task-table thead th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-table tbody td {
  color: #333;
  border: 1px solid #d5d5d5;
  text-align: center;
}

.task-table tbody .tr-bd td {
  padding: 15px;
}

.project-basic {
  width: 100%;
  margin-right: -120px;
  padding-right: 120px;
  line-height: 30px;
}

.project-basic .ival.task-order {
  color: #333;
  font-weight: bold;
  cursor: pointer;
}

.project-basic .ival {
  color: #aaa;
  margin-right: 25px;
}

.txt-overflow {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
