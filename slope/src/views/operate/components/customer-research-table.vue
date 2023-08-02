<script setup lang="ts">
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import type { getCustomerTableListParamI, resCustomerItemI } from '@/views/operate/customer-method'
import { getCustomerListTable, pageData } from '@/views/operate/customer-method'
import api from '@/api'
import { checkAuth, checkIsOwn, delItemHandle, pageI, tableHeaderCellStyle } from '@/utils/tools'
import PermissionDeniedComp from '@/views/public-components/permission-denied-comp.vue'

const tableLoading = ref(false)

interface searchI {
  customer_name: string
  address_province: string
  address_city: string
}

const searchData: Record<string, string> = reactive<searchI>({
  customer_name: '',
  address_province: '',
  address_city: '',
})
const tableData = ref<resCustomerItemI[]>([])
const getList = async (otherParam: getCustomerTableListParamI) => {
  if (!checkAuth('PM00102002')) return
  tableLoading.value = true
  const res = await getCustomerListTable(otherParam)
  tableData.value = res.list as resCustomerItemI[]
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const pcas = ref<string[]>([])
const pageChange = () => {
  const data: getCustomerTableListParamI = { ...pageData }
  if (searchData.customer_name) data.customer_name = searchData.customer_name
  if (pcas.value && pcas.value.length) {
    data.address_province = pcas.value[0]
    data.address_city = pcas.value[1]
  }
  getList(data)
}
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
const router = useRouter()
const researchNameClick = (row: resCustomerItemI) => router.push(`/customer-management/customer-detail?customer_id=${ row.customer_id }`)
const editItem = (row: resCustomerItemI) => router.push(`/customer-management/customer-form?customer_id=${ row.customer_id }`)
const delCb = async (id: string) => {
  await api.post('/customer/delCustomer', { customer_id: id })
  pageChange()
}
const delItem = async (row: resCustomerItemI) => delItemHandle(row.customer_name, delCb, row.customer_id)

const checkEditAuth = (item: resCustomerItemI) => {
  const isOwn = checkIsOwn(item.registrant_user)
  const isHadAuth = checkAuth('PM00102003')
  return isOwn && isHadAuth
}
</script>

<template>
  <Auth :value="['PM00102002']">
    <div class="search-box">
      <el-form class="search-form" :model="searchData" inline>
        <el-form-item label="客户名称：">
          <el-input v-model="searchData.customer_name" clearable />
        </el-form-item>
        <el-form-item label="地区：">
          <pcas-cascader v-model="pcas" type="pc" format="name" />
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
      <el-table-column label="客户名称" min-width="230">
        <template #default="scope">
          <Auth :value="['PM00102002']">
            <a style="color: #4099ff; cursor:pointer;" @click="researchNameClick(scope.row)">
              {{ scope.row.customer_name }}
            </a>
            <template #no-auth>
              {{ scope.row.customer_name }}
            </template>
          </Auth>
        </template>
      </el-table-column>
      <el-table-column property="customer_department" label="部门" width="120" />
      <el-table-column property="primary_business" label="主营业务" width="230" />
      <el-table-column label="地址" width="190">
        <template #default="scope">
          {{ scope.row.address_province }} {{ scope.row.address_city }}
        </template>
      </el-table-column>
      <el-table-column property="linkman" label="联系人" width="80" />
      <el-table-column property="linkman_phone" label="联系电话" width="130" />
      <el-table-column property="linkman_post" label="联系人职务/职称" width="160" />
      <el-table-column property="registrant_user" label="登记人" width="80" />
      <el-table-column property="registration_time" label="登记时间" width="160" />
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button v-if="checkEditAuth(scope.row)" link type="primary" size="small" @click.prevent="editItem(scope.row)">
            编辑
          </el-button>
          <el-button v-if="checkIsOwn(scope.row.registrant_user)" link type="primary" size="small" @click.prevent="delItem(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <PaginationComp :page-data="pageData as pageI" @page-change="pageChange" />
    <template #no-auth>
      <PermissionDeniedComp />
    </template>
  </Auth>
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
