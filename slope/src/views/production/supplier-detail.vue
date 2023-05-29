<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { back, getDownloadUrl } from '@/views/scientific_research/project-method'
import type { resSupplierI } from '@/views/production/supplier-method'
import { activeSupplier, getSupplier, loading } from '@/views/production/supplier-method'
import { baseURL } from '@/api'

let supplier_id = ''
const route = useRoute()
const router = useRouter()
const query = route.query
const getDetail = async () => {
  const { supplier_id: editId } = query
  supplier_id = editId as string
  if (!supplier_id) {
    ElMessage.error('供应商id不正确')
    router.push('/supplier-management/supplier-list')
    return
  }
  loading.value = true
  const data = await getSupplier(supplier_id)
  activeSupplier.value = data as resSupplierI
  loading.value = false
}
getDetail()

const toEdit = () => router.push(`/supplier-management/supplier-form?supplier_id=${ supplier_id }`)
const downloadItem = async (url: string) => {
  loading.value = true
  const res = await getDownloadUrl(url.slice(4))
  window.open(baseURL + res.down_url.slice(3))
  loading.value = false
}
</script>

<template>
  <page-main v-loading="loading" class="page-main">
    <div class="top">
      <div>
        供应商信息
      </div>
      <div>
        <el-button type="primary" @click="toEdit">
          编辑
        </el-button>
        <el-button @click="back">
          返回
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <el-descriptions :column="1">
        <el-descriptions-item label="供应商名称：">
          {{ activeSupplier.supplier_name }}
        </el-descriptions-item>
        <el-descriptions-item label="供应商分类：">
          {{ activeSupplier.supplier_type }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1">
        <el-descriptions-item label="主营业务：">
          {{ activeSupplier.primary_business }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1">
        <el-descriptions-item label="地址：">
          {{ activeSupplier.address_province }} {{ activeSupplier.address_city }} {{ activeSupplier.address_detail }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人：">
          {{ activeSupplier.linkman }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人电话：">
          {{ activeSupplier.linkman_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人职务：">
          {{ activeSupplier.linkman_post }}
        </el-descriptions-item>
        <el-descriptions-item label="企业资质：">
          {{ activeSupplier.enterprise_qualification }}
        </el-descriptions-item>
        <el-descriptions-item label="附件：">
          <el-button link type="primary" @click="downloadItem(activeSupplier.attachment_url as string)">
            {{ activeSupplier.attachment_name }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="登记人：">
          {{ activeSupplier.registrant_user }}
        </el-descriptions-item>
        <el-descriptions-item label="登记时间：">
          {{ activeSupplier.registration_time }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1">
        <el-descriptions-item label="供应商概况：">
          {{ activeSupplier.supplier_general }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </page-main>
</template>

<style scoped lang="scss">
.page-main {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bottom {
    margin-top: 20px;
  }
}
</style>
