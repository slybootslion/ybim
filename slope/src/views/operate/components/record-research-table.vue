<script setup lang="ts">
import type { getRecordTableListI, resRecordItemI } from '@/views/operate/record-method'
import { delFiling, getFilingList, pageData } from '@/views/operate/record-method'
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import { delItemHandle, pageI } from '@/utils/tools'

const tableLoading = ref(false)
const tableData = ref<resRecordItemI[]>([])
const getList = async (param: getRecordTableListI) => {
  tableLoading.value = true
  delete param.total
  const res = await getFilingList(param)
  tableData.value = res.list as resRecordItemI[]
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const pcas = ref<string[]>([])
const searchData: getRecordTableListI = reactive<getRecordTableListI>({
  filing_type: '',
  filing_province: '',
  filing_city: '',
  filing_department: '',
  filing_platform: '',
  responsible_person: '',
  page_number: 0,
  page_size: 0,
})
const pageChange = () => {
  const data: getRecordTableListI = { ...pageData }
  if (searchData.filing_type) data.filing_type = searchData.filing_type
  if (searchData.filing_platform) data.filing_platform = searchData.filing_platform
  if (searchData.filing_department) data.filing_department = searchData.filing_department
  if (searchData.responsible_person) data.responsible_person = searchData.responsible_person
  if (pcas.value && pcas.value.length) {
    data.filing_province = pcas.value[0]
    data.filing_city = pcas.value[1]
  }
  getList(data)
}
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
const router = useRouter()
const researchNameClick = (row: resRecordItemI) => router.push(`/record-management/record-detail?filing_id=${row.filing_id}`)
const editItem = (filing_id: string) => router.push(`/record-management/record-form?filing_id=${filing_id}`)
const delItem = async (row: resRecordItemI) => {
  await delItemHandle(row.filing_platform, delFiling, row.filing_id)
  pageChange()
}
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <el-form-item label="客户名称：">
        <el-select v-model="searchData.filing_type" clearable>
          <el-option label="本地备案" value="本地备案" />
          <el-option label="网络备案" value="网络备案" />
        </el-select>
      </el-form-item>
      <el-form-item label="备案地区：">
        <pcas-cascader v-model="pcas" type="pc" format="name" />
      </el-form-item>
      <el-form-item label="备案平台名称/部门：">
        <el-input v-model="searchData.filing_platform" clearable />
      </el-form-item>
      <el-form-item label="备案单位：">
        <el-input v-model="searchData.filing_department" clearable />
      </el-form-item>
      <el-form-item label="经办人：">
        <el-input v-model="searchData.responsible_person" clearable />
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
    <el-table-column label="备案平台名称/部门" min-width="230">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row)">
          {{ scope.row.filing_platform }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column property="filing_type" label="备案类型" width="120" />
    <el-table-column property="filing_department" label="备案单位" width="230" />
    <el-table-column label="备案省份城市" width="190">
      <template #default="scope">
        {{ scope.row.filing_province }} {{ scope.row.filing_city }}
      </template>
    </el-table-column>
    <el-table-column property="filing_valid_time" label="备案有效日期" width="130" />
    <el-table-column property="responsible_person" label="经办人" width="160" />
    <el-table-column property="filing_time" label="备案时间" width="130" />
    <el-table-column label="有效状态" width="90">
      <template #default="scope">
        <el-tag
          :type="scope.row.valid.includes('无效') ? 'danger' : ''"
          disable-transitions
        >
          {{ scope.row.valid }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="130">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="editItem(scope.row.filing_id)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click.prevent="delItem(scope.row)">
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
    width: 150px !important;
  }
}
.pagination {
  margin-top: 10px;
}
</style>
