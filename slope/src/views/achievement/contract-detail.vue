<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { back, getDownloadUrl } from '@/views/scientific_research/project-method'
import { activeContract, getContract, loading } from '@/views/achievement/contract-method'
import { baseURL } from '@/api'
import PermissionDeniedComp from '@/views/public-components/permission-denied-comp.vue'

let contract_id = ''
const route = useRoute()
const router = useRouter()
const query = route.query
const getDetail = async () => {
  const { contract_id: editId } = query
  contract_id = editId as string
  if (!contract_id) {
    ElMessage.error('合同id不正确')
    router.push('/achievement-contract/contract')
    return
  }
  loading.value = true
  activeContract.value = await getContract(contract_id)
  loading.value = false
}
getDetail()
const toEdit = () => router.push(`/achievement-contract/contract-form?contract_id=${contract_id}`)
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
        合同登记
      </div>
      <div>
        <el-button v-auth="['PM00301003']" type="primary" @click="toEdit">
          编辑
        </el-button>
        <el-button @click="back">
          返回
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <Auth :value="['PM00301001']">
        <el-descriptions :column="1">
          <el-descriptions-item label="所属项目：">
            {{ activeContract.project_name }}
          </el-descriptions-item>
          <el-descriptions-item label="合同名称：">
            {{ activeContract.contract_name }}
          </el-descriptions-item>
          <el-descriptions-item label="合同编号：">
            {{ activeContract.contract_number }}
          </el-descriptions-item>
          <el-descriptions-item label="甲方：">
            {{ activeContract.first_party_name }}
          </el-descriptions-item>
          <el-descriptions-item label="乙方：">
            {{ activeContract.second_party_name }}
          </el-descriptions-item>
          <el-descriptions-item label="合同金额（万元）：">
            {{ activeContract.contract_money }} 万
          </el-descriptions-item>
          <el-descriptions-item label="合同类型：">
            {{ activeContract.contract_type }}
          </el-descriptions-item>
          <el-descriptions-item label="收支类型：">
            {{ activeContract.payment_type }}
          </el-descriptions-item>
          <el-descriptions-item label="行业类型：">
            {{ activeContract.industry_type }}
          </el-descriptions-item>
          <el-descriptions-item label="项目等级：">
            {{ activeContract.rank_size }}
          </el-descriptions-item>
          <el-descriptions-item label="合同签订日期：">
            {{ activeContract.sign_time }}
          </el-descriptions-item>
          <el-descriptions-item label="合同所属部门：">
            {{ activeContract.operation_department }}
          </el-descriptions-item>
          <el-descriptions-item label="登记人：">
            {{ activeContract.registrant_user }}
          </el-descriptions-item>
          <el-descriptions-item label="登记时间：">
            {{ activeContract.create_time }}
          </el-descriptions-item>
          <el-descriptions-item label="项目规模：">
            {{ activeContract.project_scale }}
          </el-descriptions-item>
          <el-descriptions-item label="需重点关注问题及其他必要情况说明：">
            {{ activeContract.attention }}
          </el-descriptions-item>
          <el-descriptions-item label="合同附件：">
            <el-button
              link type="primary"
              @click="downloadItem(activeContract.attachment_url)"
            >
              {{ activeContract.attachment_name }}
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
        <template #no-auth>
          <PermissionDeniedComp />
        </template>
      </Auth>
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
