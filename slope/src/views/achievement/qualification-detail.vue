<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { activeQualification, getAptitude, loading, resQualificationI } from '@/views/achievement/qualification-method'
import { back, getDownloadUrl } from '@/views/scientific_research/project-method'
import { baseURL } from '@/api'

let aptitude_id = ''
const route = useRoute()
const router = useRouter()
const query = route.query
const getDetail = async () => {
  const { aptitude_id: editId } = query
  aptitude_id = editId as string
  if (!aptitude_id) {
    ElMessage.error('资质id不正确')
    router.push('/achievement-qualification/qualification')
    return
  }
  loading.value = true
  activeQualification.value = await getAptitude(aptitude_id)
  loading.value = false
}
getDetail()
const downloadItem = async (url: string) => {
  loading.value = true
  const res = await getDownloadUrl(url.slice(4))
  window.open(baseURL + res.down_url.slice(3))
  loading.value = false
}
const toEdit = () => router.push(`/achievement-qualification/qualification-form?aptitude_id=${aptitude_id}`)
</script>

<template>
  <page-main v-loading="loading" class="page-main">
    <div class="top">
      <div>
        资质信息
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
        <el-descriptions-item label="资质名称：">
          {{ (activeQualification as resQualificationI).aptitude_name }}
        </el-descriptions-item>
        <el-descriptions-item label="证书号码：">
          {{ (activeQualification as resQualificationI).cert_number }}
        </el-descriptions-item>
        <el-descriptions-item label="资质类别：">
          {{ (activeQualification as resQualificationI).aptitude_type }}
        </el-descriptions-item>
        <el-descriptions-item label="所属单位：">
          {{ (activeQualification as resQualificationI).department }}
        </el-descriptions-item>
        <el-descriptions-item label="证书有效日期：">
          {{ (activeQualification as resQualificationI).cert_valid_time }}
        </el-descriptions-item>
        <el-descriptions-item label="资质等级：">
          {{ (activeQualification as resQualificationI).aptitude_grade }}
        </el-descriptions-item>
        <el-descriptions-item label="负责人：">
          {{ (activeQualification as resQualificationI).principal }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话：">
          {{ (activeQualification as resQualificationI).principal_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="原件保管人：">
          {{ (activeQualification as resQualificationI).original_keeper }}
        </el-descriptions-item>
        <el-descriptions-item label="登记人：">
          {{ (activeQualification as resQualificationI).registrant_user }}
        </el-descriptions-item>
        <el-descriptions-item label="原件总数：">
          {{ (activeQualification as resQualificationI).original_amount }}
        </el-descriptions-item>
        <el-descriptions-item label="现存原件数：">
          {{ (activeQualification as resQualificationI).extant_original_amount }}
        </el-descriptions-item>
        <el-descriptions-item label="资质描述：">
          {{ (activeQualification as resQualificationI).aptitude_description }}
        </el-descriptions-item>
        <el-descriptions-item label="附件：">
          <el-button
            link type="primary"
            @click="downloadItem((activeQualification as resQualificationI).cert_attachment_url as string)"
          >
            {{ (activeQualification as resQualificationI).cert_attachment_name }}
          </el-button>
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
