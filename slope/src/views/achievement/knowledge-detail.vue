<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { activeKnowledge, getIpr, loading, resKnowledgeI } from '@/views/achievement/knowledge-method'
import { back, getDownloadUrl } from '@/views/scientific_research/project-method'
import { baseURL } from '@/api'
import PermissionDeniedComp from "@/views/public-components/permission-denied-comp.vue";

let ip_id = ''
const route = useRoute()
const router = useRouter()
const query = route.query
const getDetail = async () => {
  const { ip_id: editId } = query
  ip_id = editId as string
  if (!ip_id) {
    ElMessage.error('知识产权id不正确')
    router.push('/achievement-knowledge/knowledge')
    return
  }
  loading.value = true
  activeKnowledge.value = await getIpr(ip_id)
  console.log(activeKnowledge.value)
  loading.value = false
}
getDetail()
const toEdit = () => {
}
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
        知识产权信息
      </div>
      <div>
        <el-button v-auth="['PM00303003']" type="primary" @click="toEdit">
          编辑
        </el-button>
        <el-button @click="back">
          返回
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <Auth :value="['PM00303001']">
        <el-descriptions :column="2">
          <el-descriptions-item label="类型：">
            {{ (activeKnowledge as resKnowledgeI).result_type }}
          </el-descriptions-item>
          <el-descriptions-item label="专利/授权/申请号：">
            {{ (activeKnowledge as resKnowledgeI).request_code }}
          </el-descriptions-item>
          <el-descriptions-item label="名称：">
            {{ (activeKnowledge as resKnowledgeI).result_name }}
          </el-descriptions-item>
          <el-descriptions-item label="权属人：">
            {{ (activeKnowledge as resKnowledgeI).property_owner }}
          </el-descriptions-item>
          <el-descriptions-item label="著作人：">
            {{ (activeKnowledge as resKnowledgeI).copyright_owner }}
          </el-descriptions-item>
          <el-descriptions-item label="代理机构：">
            {{ (activeKnowledge as resKnowledgeI).agent }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间：">
            {{ (activeKnowledge as resKnowledgeI).application_time }}
          </el-descriptions-item>
          <el-descriptions-item label="授权/受理时间：">
            {{ (activeKnowledge as resKnowledgeI).authorize_time }}
          </el-descriptions-item>
          <el-descriptions-item label="有效期：">
            {{ (activeKnowledge as resKnowledgeI).validity }}
          </el-descriptions-item>
          <el-descriptions-item label="申请部门：">
            {{ (activeKnowledge as resKnowledgeI).application_department }}
          </el-descriptions-item>
          <el-descriptions-item label="联系人：">
            {{ (activeKnowledge as resKnowledgeI).linkman }}
          </el-descriptions-item>
          <el-descriptions-item label="缴纳年费：">
            {{ (activeKnowledge as resKnowledgeI).yearly_payment_status }}
          </el-descriptions-item>
          <el-descriptions-item label="年费（元）：">
            {{ (activeKnowledge as resKnowledgeI).yearly_payment }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1">
          <el-descriptions-item label="附件其他：">
            <el-button
              link type="primary"
              @click="downloadItem(activeKnowledge.other_attachment_url)"
            >
              {{ (activeKnowledge as resKnowledgeI).other_attachment_name }}
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="成果证书：">
            <el-button
              link type="primary"
              @click="downloadItem(activeKnowledge.result_cert_attachment_url)"
            >
              {{ (activeKnowledge as resKnowledgeI).result_cert_attachment_name }}
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
