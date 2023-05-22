<script setup lang="ts">
import type {getQualificationTableListI, resQualificationTableItemI} from '@/views/achievement/qualification-method'
import {
  getAptitudeList, pageData, primaryAptitudeGradeOption, primaryAptitudeTypeOption,
} from '@/views/achievement/qualification-method'
import PaginationComp from '@/views/public-components/pagination-comp.vue'

const tableLoading = ref(false)
let tableData = reactive<resQualificationTableItemI[]>([])
const getList = async (param: getQualificationTableListI) => {
  tableLoading.value = true
  delete param.total
  const res = await getAptitudeList(param)
  tableData = res.list
  pageData.total = res.total
  tableLoading.value = false
}
getList(pageData)
const searchData: getQualificationTableListI = reactive<getQualificationTableListI>({
  page_size: 0,
  page_number: 0,
})
const pageChange = () => {
  const data: getQualificationTableListI = {...pageData}
  if (searchData.aptitude_type) data.aptitude_type = searchData.aptitude_type
  if (searchData.aptitude_name) data.aptitude_name = searchData.aptitude_name
  if (searchData.aptitude_grade) data.aptitude_grade = searchData.aptitude_grade
  getList(data)
}
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
const router = useRouter()
const researchNameClick = (id: string) => router.push(`/achievement-qualification/qualification-detail?aptitude_id=${id}`)
const editItem = (id: string) => router.push(`/achievement-qualification/qualification-form?aptitude_id=${id}`)
const delItem = (row: resQualificationTableItemI) => {
}
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <el-form-item label="资质名称：">
        <el-input v-model="searchData.aptitude_name" clearable/>
      </el-form-item>
      <el-form-item label="资质等级：">
        <el-select v-model="searchData.aptitude_grade" clearable>
          <el-option v-for="aptg in primaryAptitudeGradeOption" :key="aptg" :label="aptg" :value="aptg"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资质类别：">
        <el-select v-model="searchData.aptitude_type" clearable>
          <el-option v-for="aptt in primaryAptitudeTypeOption" :key="aptt" :label="aptt" :value="aptt"/>
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
    <el-table-column label="序号" type="index" width="50"/>
    <el-table-column label="资质名称" min-width="230">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row.aptitude_id)">
          {{ scope.row.aptitude_name }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column property="cert_number" label="证书号码" width="120"/>
    <el-table-column property="aptitude_type" label="资质类别" width="120"/>
    <el-table-column property="aptitude_grade" label="资质等级" width="100"/>
    <el-table-column property="department" label="所属单位" width="260"/>
    <el-table-column property="original_amount" label="原件总数" width="100"/>
    <el-table-column property="extant_original_amount" label="现原件总数" width="100"/>
    <el-table-column property="original_keeper" label="原件保管人" width="100"/>
    <el-table-column property="principal_phone" label="联系电话" width="160"/>
    <el-table-column label="操作" width="130">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="editItem(scope.row.aptitude_id)">
          编辑
        </el-button>
        <el-button link type="primary" size="small" @click.prevent="delItem(scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <PaginationComp @page-change="pageChange"/>
</template>

<style scoped lang="scss">
//
</style>
