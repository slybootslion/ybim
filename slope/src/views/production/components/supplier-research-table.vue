<script setup lang="ts">
import type { getSupplierTableListI, resSupplierTableItemI } from '@/views/production/supplier-method'
import { getSupplierList, pageData, primarySupplierTypeOption } from '@/views/production/supplier-method'
import PaginationComp from '@/views/public-components/pagination-comp.vue'
import { delItemHandle } from '@/utils/tools'
import api from '@/api'

const tableLoading = ref(false)
let tableData = reactive<resSupplierTableItemI[]>([])
const getList = async (param: getSupplierTableListI) => {
  tableLoading.value = true
  delete param.total
  const res = await getSupplierList(param)
  tableData = res.list
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const pcas = ref<string[]>([])
const searchData: getSupplierTableListI = reactive<getSupplierTableListI>({
  page_size: 0,
  page_number: 0,
  supplier_name: '',
  address_province: '',
  address_city: '',
  supplier_type: '',
})
const pageChange = () => {
  const data: getSupplierTableListI = { ...pageData }
  if (searchData.supplier_name) data.supplier_name = searchData.supplier_name
  if (searchData.supplier_type) data.supplier_type = searchData.supplier_type
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
const researchNameClick = (id: string) => router.push(`/supplier-management/supplier-detail?supplier_id=${ id }`)
const editItem = async (id: string) => router.push(`/supplier-management/supplier-form?supplier_id=${ id }`)
const delCb = async (id: string) => {
  await api.post('/supplier/delSupplier', { supplier_id: id })
  pageChange()
}
const delItem = (row: resSupplierTableItemI) => delItemHandle(row.supplier_name, delCb, row.supplier_id)
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <el-form-item label="供应商名称：">
        <el-input v-model="searchData.supplier_name" clearable />
      </el-form-item>
      <el-form-item label="地区：">
        <pcas-cascader v-model="pcas" type="pc" format="name" />
      </el-form-item>
      <el-form-item label="供应商分类：">
        <el-select v-model="searchData.supplier_type" clearable>
          <el-option v-for="sup in primarySupplierTypeOption" :key="sup" :label="sup" :value="sup" />
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
    <el-table-column label="序号" type="index" width="50" />
    <el-table-column label="供应商名称" min-width="230">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row.supplier_id)">
          {{ scope.row.supplier_name }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column property="supplier_type" label="供应商分类" width="120" />
    <el-table-column property="primary_business" label="主营业务" width="310" />
    <el-table-column label="地址" width="190">
      <template #default="scope">
        {{ scope.row.address_province }} {{ scope.row.address_city }}
      </template>
    </el-table-column>
    <el-table-column property="linkman" label="联系人" width="90" />
    <el-table-column property="linkman_phone" label="联系人电话" width="130" />
    <el-table-column property="registrant_user" label="登记人" width="90" />
    <el-table-column property="registration_time" label="登记时间" width="160" />
    <el-table-column label="操作" width="130">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="editItem(scope.row.supplier_id)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click.prevent="delItem(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <PaginationComp @page-change="pageChange" />
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
