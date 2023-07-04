<script setup lang="ts">
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import type {
  approveFormDataI,
} from '@/views/operate/project-method'
import {
  activeContractReviewData, activeProjectData, approveSubmit, downloadItem, getContractReview,
  resContractReviewI, resProjectDataI, rules,
} from '@/views/operate/project-method'
import api from '@/api'
import { back } from '@/views/scientific_research/project-method'

const props = defineProps<{
  projectId: string
}>()
const emit = defineEmits(['goRouter'])
const loading = ref(false)
const formData: approveFormDataI = reactive<approveFormDataI>({
  approve_contents: '',
  approve_id: '',
})
const getDetail = async () => {
  loading.value = true
  const data = await getContractReview(props.projectId)
  activeContractReviewData.value = data as resContractReviewI
  if (data && data.approve_id) formData.approve_id = data.approve_id
  loading.value = false
}
getDetail()
const ruleFormRef = ref<FormInstance>()

const cancel = () => {
  ElMessageBox.confirm('点击确定后将无法恢复，是否继续？', '注意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const res: any = await api.post('/project/cancelContractReview', { conre_id: activeContractReviewData.value.conre_id })
    if (res && res.code === 0) {
      ElMessage({ type: 'success', message: '已取消' })
      back()
    }
  }).catch(console.log)
}
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <div class="top-button">
        <el-button type="primary" @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/contract-rating/contract-review' })"
        >
          重新发起
        </el-button>
      </div>
      <el-descriptions title="基本信息" :column="2" style="margin-bottom: 20px;">
        <el-descriptions-item label="所属项目：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="合同名称：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).contract_name }}
        </el-descriptions-item>
        <el-descriptions-item label="合同编号：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).contract_number }}
        </el-descriptions-item>
        <el-descriptions-item label="甲方：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).first_party }}
        </el-descriptions-item>
        <el-descriptions-item label="乙方：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).second_party }}
        </el-descriptions-item>
        <el-descriptions-item label="合同金额（万元）：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).contract_money }} 万元
        </el-descriptions-item>
        <el-descriptions-item label="合同类型：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).contract_type }}
        </el-descriptions-item>
        <el-descriptions-item label="经办人：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).responsible_person }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="合同内容概述：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).responsible_person }}
        </el-descriptions-item>
        <el-descriptions-item label="需要重点关注问题及其他必要情况说明：">
          {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).attention }}
        </el-descriptions-item>
        <el-descriptions-item label="附件：">
          <el-button
            link type="primary"
            @click="downloadItem((activeContractReviewData as resContractReviewI).attachment_url as string)"
          >
            {{ activeContractReviewData && (activeContractReviewData as resContractReviewI).attachment_name }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-if="activeContractReviewData && (activeContractReviewData as resProjectDataI).approve_id"
        ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px"
        style="margin-bottom: 20px;"
      >
        <el-descriptions title="审核信息" :column="1">
          <el-descriptions-item label="审核：">
            <el-form-item label="" prop="approve_result">
              <el-radio-group v-model="formData.approve_result">
                <el-radio :label="1">
                  通过
                </el-radio>
                <el-radio :label="-1">
                  不通过
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="审核意见：">
            <el-form-item label="" prop="approve_contents">
              <el-input v-model="formData.approve_contents" type="textarea" rows="1" />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="">
            <el-button type="primary" @click="approveSubmit(ruleFormRef as FormInstance, formData, getDetail)">
              提交
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
      </el-form>
      <el-descriptions style="margin-top: 20px;" title="审批意见" :column="1">
        <el-descriptions-item
          v-for="(item, index) in (activeContractReviewData && (activeContractReviewData as resContractReviewI).conre_approve)"
          :key="index" label="审核人："
        >
          {{ item.approve_user }} (<span>{{ item.approve_result }}</span>)
          <div style="margin: 10px 0;">
            {{ item.approve_contents }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./tab-comp-style";
</style>
