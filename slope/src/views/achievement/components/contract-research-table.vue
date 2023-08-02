<script setup lang="ts">
import type { getContractListI, resContractListItemI } from '@/views/achievement/contract-method'
import type { getProjectTableListI } from '@/views/production/project-method'
import { pageData } from '@/views/production/project-method'
import { contractTypeOptions, getContractList, industryTypeOption } from '@/views/achievement/contract-method'
import { getTreeList, level3List } from '@/views/system/personnel-method'
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import { checkAuth, checkIsOwn, delItemHandle, pageI, tableHeaderCellStyle } from '@/utils/tools'
import { getDownloadUrl } from '@/views/scientific_research/project-method'
import api, { baseURL } from '@/api'

getTreeList()
const tableLoading = ref(false)
let tableData = reactive<resContractListItemI[]>([])
const getList = async (param: getProjectTableListI) => {
  if (!checkAuth('PM00301001')) return
  tableLoading.value = true
  delete param.total
  const res = await getContractList(param)
  tableData = res.list
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const searchData: getContractListI = reactive<getContractListI>({
  page_size: 0,
  page_number: 0,
  payment_type: '',
  contract_type: '',
  industry_type: '',
  operation_department: '',
  project_name: '',
})
const pageChange = () => {
  const data: getContractListI = { ...pageData }
  if (searchData.payment_type) data.payment_type = searchData.payment_type
  if (searchData.contract_type) data.contract_type = searchData.contract_type
  if (searchData.industry_type) data.industry_type = searchData.industry_type
  if (searchData.operation_department) data.operation_department = searchData.operation_department
  if (searchData.project_name) data.project_name = searchData.project_name
  getList(data)
}
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
const router = useRouter()
const researchNameClick = (id: string) => router.push(`/achievement-contract/contract-detail?contract_id=${ id }`)
const editItem = (id: string) => router.push(`/achievement-contract/contract-form?contract_id=${ id }`)
const delCb = async (contract_id: string) => {
  await api.post('/contract/delContract', { contract_id })
  pageChange()
}
const delItem = (row: resContractListItemI) => delItemHandle(row.contract_name, delCb, row.contract_id)
const downloadItem = async (row: resContractListItemI) => {
  tableLoading.value = true
  const res = await getDownloadUrl(row.attachment_url.slice(4))
  window.open(baseURL + res.down_url.slice(3))
  tableLoading.value = false
}
const checkEditAuth = (row: resContractListItemI) => {
  const isOwn = checkIsOwn(row.registrant_user)
  const isAuth = checkAuth('PM00301003')
  return isOwn && isAuth
}

const checkDelAuth = (row: resContractListItemI) => {
  const isOwn = checkIsOwn(row.registrant_user)
  const isAuth = checkAuth('PM00301004')
  return isOwn && isAuth
}
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <el-form-item label="收支类型：">
        <el-select v-model="searchData.payment_type" clearable>
          <el-option label="收入" value="收入" />
          <el-option label="支出" value="支出" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同类型：">
        <el-select v-model="searchData.contract_type" clearable>
          <el-option v-for="con in contractTypeOptions" :key="con" :label="con" :value="con" />
        </el-select>
      </el-form-item>
      <el-form-item label="行业类型：">
        <el-select v-model="searchData.industry_type" clearable>
          <el-option v-for="ind in industryTypeOption" :key="ind" :label="ind" :value="ind" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门：">
        <el-select v-model="searchData.operation_department" clearable>
          <el-option v-for="item in level3List" :key="item.value" :label="item.label as string" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称：">
        <el-input v-model="searchData.project_name" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
    <el-table-column label="序号" type="index" fixed width="60" />
    <el-table-column property="contract_number" fixed label="合同编码" width="160" />
    <el-table-column label="合同名称" min-width="330" fixed>
      <template #default="scope">
        <Auth :value="['PM00301001']">
          <a style="color: #4099ff; cursor:pointer;" @click="researchNameClick(scope.row.contract_id)">
            {{ scope.row.contract_name }}
          </a>
          <template #no-auth>
            {{ scope.row.contract_name }}
          </template>
        </Auth>
      </template>
    </el-table-column>
    <el-table-column property="contract_type" label="合同类型" width="110" />
    <el-table-column property="payment_type" label="收支类型" width="110" />
    <el-table-column property="contract_money" label="合同金额（万元）" width="160" />
    <el-table-column property="first_party" label="甲方" width="260" />
    <el-table-column property="second_party" label="乙方" width="260" />
    <el-table-column property="project_name" label="所属项目" width="280" />
    <el-table-column property="industry_type" label="行业类型" width="120" />
    <el-table-column property="rank_size" label="项目等级" width="110" />
    <el-table-column property="operation_department" label="所属部门" width="260" />
    <el-table-column property="sign_time" label="签订日期" width="160" />
    <el-table-column property="registrant_user" label="登记人" width="110" />
    <el-table-column property="create_time" label="登记日期" width="160" />
    <el-table-column v-auth="['PM00301003', 'PM00301004', 'PM00301005']" label="操作" width="180">
      <template #default="scope">
        <el-button v-if="checkEditAuth(scope.row)" link type="primary" size="small" @click.prevent="editItem(scope.row.contract_id)">
          编辑
        </el-button>
        <el-button v-if="checkDelAuth(scope.row)" link type="primary" size="small" @click.prevent="delItem(scope.row)">
          删除
        </el-button>
        <el-button v-auth="['PM00301005']" link type="primary" size="small" @click.prevent="downloadItem(scope.row)">
          下载
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <PaginationComp :page-data="pageData as pageI" @page-change="pageChange" />
</template>

<style scoped lang="scss">
.search-box {
  :deep(.el-select),
  :deep(.el-input) {
    width: 320px !important;
  }
}
.pagination {
  margin-top: 10px;
}
</style>
