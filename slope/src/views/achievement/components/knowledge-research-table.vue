<script setup lang="ts">
import type { getKnowledgeTableListI, resKnowledgeTableItemI } from '@/views/achievement/knowledge-method'
import { getIprList, pageData } from '@/views/achievement/knowledge-method'
import { primaryAptitudeGradeOption } from '@/views/achievement/qualification-method'

const tableLoading = ref(false)
let tableData = reactive<resKnowledgeTableItemI[]>([])
const getList = async (param: getKnowledgeTableListI) => {
  tableLoading.value = true
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
const researchNameClick = (id: string) => {
  console.log(id)
}
const pageChange = () => {
  const data: getKnowledgeTableListI = { ...pageData }
  if (searchData.result_type) data.result_type = searchData.result_type
  if (searchData.request_code) data.request_code = searchData.request_code
  if (searchData.result_name) data.result_name = searchData.result_name
  if (searchData.property_owner) data.property_owner = searchData.property_owner
  if (searchData.copyright_owner) data.copyright_owner = searchData.copyright_owner
  if (searchData.agent) data.agent = searchData.agent
  if (searchData.application_year) data.application_year = searchData.application_year
  if (searchData.application_time) data.application_time = searchData.application_time
  getList(data)
}
const searchHandle = () => {
  pageData.page_number = 1
  pageChange()
}
const editItem = (id: string) => {
}
const delItem = (row: resKnowledgeTableItemI) => {
}
</script>

<template>
  <div class="search-box">
    <el-form class="search-form" :model="searchData" inline>
      <el-form-item label="申请年限：">
        <el-input v-model="searchData.application_year" clearable />
      </el-form-item>
      <el-form-item label="授权年度：">
        <el-select v-model="searchData.application_time" clearable>
          <el-option v-for="aptg in primaryAptitudeGradeOption" :key="aptg" :label="aptg" :value="aptg" />
        </el-select>
      </el-form-item>
      <el-form-item label="名称：">
        <el-input v-model="searchData.result_name" clearable />
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
    <el-table-column property="request_code" label="申请号" width="120" />
    <el-table-column label="名称" min-width="230">
      <template #default="scope">
        <el-button link type="primary" @click="researchNameClick(scope.row.supplier_id)">
          {{ scope.row.result_name }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column property="result_type" label="类型" width="150" />
    <el-table-column property="copyright_owner" label="发明人" width="120" />
    <el-table-column property="property_owner" label="专利权人" width="120" />
    <el-table-column property="application_year" label="申请年度" width="120" />
    <el-table-column property="application_time" label="授权年度" width="120" />
    <el-table-column property="validity" label="有效期" width="120" />
    <el-table-column label="操作" width="180">
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
