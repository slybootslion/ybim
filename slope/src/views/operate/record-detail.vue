<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { resFilingI } from '@/views/operate/record-method'
import { activeFilingData, getFiling, loading } from '@/views/operate/record-method'
import { back, getDownloadUrl } from '@/views/scientific_research/project-method'
import { baseURL } from '@/api'

const route = useRoute()
const router = useRouter()
let filing_id = ''

const getDetail = async () => {
  const { filing_id: editId } = route.query
  filing_id = editId as string
  if (!filing_id) {
    ElMessage.error('备案id不正确')
    router.push('/record-management/record')
    return
  }
  loading.value = true
  const data = await getFiling(filing_id)
  activeFilingData.value = data as resFilingI
  loading.value = false
}
getDetail()

const toEdit = () => router.push(`/record-management/record-form?filing_id=${ filing_id }`)

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
        备案信息
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
        <el-descriptions-item label="备案类型：">
          {{ activeFilingData.filing_type }}
        </el-descriptions-item>
        <el-descriptions-item label="备案省份：">
          {{ activeFilingData.filing_province }}
        </el-descriptions-item>
        <div v-if="activeFilingData.filing_type === '网络备案'">
          <el-descriptions-item label="备案网址：">
            {{ activeFilingData.filing_url }}
          </el-descriptions-item>
          <el-descriptions-item label="登录账号：">
            {{ activeFilingData.filing_url_login_account }}
          </el-descriptions-item>
          <el-descriptions-item label="登录密码：">
            {{ activeFilingData.filing_url_login_password }}
          </el-descriptions-item>
        </div>
        <el-descriptions-item v-if="activeFilingData.filing_department" label="备案单位：">
          {{ activeFilingData.filing_department }}
        </el-descriptions-item>
        <el-descriptions-item label="备案平台名称/部门：">
          {{ activeFilingData.filing_platform }}
        </el-descriptions-item>
        <el-descriptions-item label="经办人：">
          {{ activeFilingData.responsible_person }}
        </el-descriptions-item>
        <el-descriptions-item label="备案时间：">
          {{ activeFilingData.filing_time }}
        </el-descriptions-item>
        <el-descriptions-item label="备案有效日期：">
          {{ activeFilingData.filing_valid_time }}
        </el-descriptions-item>
        <el-descriptions-item label="有效状态：">
          {{ activeFilingData.valid_status === 1 ? '有效' : '过期' }}
        </el-descriptions-item>
        <el-descriptions-item label="是否密码锁：">
          {{ activeFilingData.trick_lock === 1 ? '有' : '无' }}
        </el-descriptions-item>
        <div v-if="activeFilingData.trick_lock === 1">
          <el-descriptions-item label="密码锁保管人员：">
            {{ activeFilingData.trick_lock_custodian }}
          </el-descriptions-item>
          <el-descriptions-item label="密码锁负责人电话：">
            {{ activeFilingData.trick_lock_principal_phone }}
          </el-descriptions-item>
        </div>
        <el-descriptions-item label="有无备案证书：">
          {{ activeFilingData.filing_cert === 1 ? '有' : '无' }}
        </el-descriptions-item>
        <div v-if="activeFilingData.filing_cert === 1">
          <el-descriptions-item label="备案证书扫描件上传：">
            <el-button link type="primary" @click="downloadItem(activeFilingData.filing_cert_attachment_url as string)">
              {{ activeFilingData.filing_cert_attachment_name }}
            </el-button>
          </el-descriptions-item>
        </div>
      </el-descriptions>
      <el-descriptions :column="1">
        <el-descriptions-item label="备注：">
          {{ activeFilingData.other }}
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
