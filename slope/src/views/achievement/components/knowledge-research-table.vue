<script setup lang="ts">
import type { getKnowledgeTableListI, resKnowledgeTableItemI } from '@/views/achievement/knowledge-method'
import { getIprList, pageData, primaryResultTypeOptions } from '@/views/achievement/knowledge-method'
import { checkAuth, checkIsOwn, delItemHandle, pageI, tableHeaderCellStyle } from '@/utils/tools'
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import api from '@/api'

const tableLoading = ref(false)
let tableData = reactive<resKnowledgeTableItemI[]>([])
const getList = async (param: getKnowledgeTableListI) => {
  if (!checkAuth('PM00303001')) return
  tableLoading.value = true
  // if (param.application_year) param.application_year = +param.application_year
  delete param.total
  const res = await getIprList(param)
  tableData = res.list
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const searchData: getKnowledgeTableListI = reactive<getKnowledgeTableListI>({
  page_number: 0,
  page_size: 0,
})
const router = useRouter()
const researchNameClick = (id: string) => router.push(`/achievement-knowledge/knowledge-detail?ip_id=${id}`)
const pageChange = () => {
  const data: getKnowledgeTableListI = { ...pageData }
  if (searchData.application_time) data.application_time = searchData.application_time
  if (searchData.authorize_time) data.authorize_time = searchData.authorize_time
  if (searchData.result_name) data.result_name = searchData.result_name
  if (searchData.result_type) data.result_type = searchData.result_type
  if (searchData.property_owner) data.property_owner = searchData.property_owner
  getList(data)
}
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
const editItem = (row: resKnowledgeTableItemI) => router.push(`/achievement-knowledge/knowledge-form?ip_id=${ row.ip_id }`)
const delCb = async (ip_id: string) => {
  await api.post('/ipr/delIpr', { ip_id })
  pageChange()
}
const delItem = (row: resKnowledgeTableItemI) => delItemHandle(row.result_name, delCb, row.ip_id)

const checkEditAuth = (row: resKnowledgeTableItemI) => {
  const isOwn = checkIsOwn(row.registrant_user)
  const isAuth = checkAuth('PM00303003')
  return isOwn && isAuth
}

const checkDelAuth = (row: resKnowledgeTableItemI) => {
  const isOwn = checkIsOwn(row.registrant_user)
  const isAuth = checkAuth('PM00303004')
  return isOwn && isAuth
}
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <!--      <el-form-item label="授权年度："> -->
      <!--        <el-date-picker v-model="searchData.application_year" type="year" value-format="YYYY" /> -->
      <!--      </el-form-item> -->
      <el-form-item label="申请时间：">
        <el-date-picker v-model="searchData.application_time" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="授权时间：">
        <el-date-picker v-model="searchData.authorize_time" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="名称：">
        <el-input v-model="searchData.result_name" clearable />
      </el-form-item>
      <el-form-item label="成果类型：">
        <el-select v-model="searchData.result_type" clearable>
          <el-option v-for="rt in primaryResultTypeOptions" :key="rt" :label="rt" :value="rt" />
        </el-select>
      </el-form-item>
      <el-form-item label="权属人：">
        <el-input v-model="searchData.property_owner" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchHandle">
          搜索
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
    <el-table-column label="序号" type="index" width="60" />
    <el-table-column property="request_code" label="申请号/授权/专利号" width="120" />
    <el-table-column label="名称" min-width="230">
      <template #default="scope">
        <Auth :value="['PM00303001']">
          <a style="color: #4099ff; cursor:pointer;" @click="researchNameClick(scope.row.ip_id)">
            {{ scope.row.result_name }}
          </a>
          <template #no-auth>
            {{ scope.row.result_name }}
          </template>
        </Auth>
      </template>
    </el-table-column>
    <el-table-column property="result_type" label="类型" width="150" />
    <el-table-column property="property_owner" label="权属人" width="120" />
    <el-table-column property="application_time" label="申请时间" width="120" />
    <el-table-column property="authorize_time" label="授权时间" width="120" />
    <el-table-column property="validity" label="有效期" width="120" />
    <el-table-column v-auth="['PM00303003', 'PM00303004']" label="操作" width="180">
      <template #default="scope">
        <el-button v-if="checkEditAuth(scope.row)" link type="primary" size="small" @click.prevent="editItem(scope.row)">
          编辑
        </el-button>
        <el-button v-if="checkDelAuth(scope.row)" link type="primary" size="small" @click.prevent="delItem(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <PaginationComp :page-data="pageData as pageI" @page-change="pageChange" />
</template>

<style scoped lang="scss">
.search-box {
  :deep(.el-form-item__content) {
    width: 180px !important;
  }
}

.pagination {
  margin-top: 10px;
}
</style>
