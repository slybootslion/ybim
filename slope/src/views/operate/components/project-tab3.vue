<script setup lang="ts">
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import type {
  approveFormDataI, approveItemI,
} from '@/views/operate/project-method'

import { getTender } from '@/views/operate/bid-method'
import {
  activeProjectData, activeTenderData, approveLoading, approveSubmit,
  downloadItem, resProjectDataI, resTenderI, rules,
} from '@/views/operate/project-method'
import api from '@/api'
import { back } from '@/views/scientific_research/project-method'
import ApproveList from '@/views/operate/components/approve-list.vue'
import { checkAuth, checkIsOwn, findLastAppItem } from '@/utils/tools'

const props = defineProps<{
  projectId: string
}>()
const emit = defineEmits(['goRouter'])
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)
const formData: approveFormDataI = reactive<approveFormDataI>({
  approve_contents: '',
  approve_id: '',
})
const status = ref(-Infinity)
const isOwn = ref(false)
const lastApprove = ref<approveItemI>({ approve_contents: '', approve_result: '', approve_time: '', approve_user: '' })
const getDetail = async () => {
  loading.value = true
  const data = await getTender(props.projectId)
  activeTenderData.value = data as resTenderI
  if (data && data.approve_id) formData.approve_id = data.approve_id
  if (data && data.tender_approve) {
    lastApprove.value = findLastAppItem(data.tender_approve)
    isOwn.value = checkIsOwn(data.applicant_user)
  }
  loading.value = false
}
getDetail()

watchEffect(() => {
  status.value = activeProjectData.value.project_status
})

const cancel = async () => {
  ElMessageBox.confirm('点击确定后将无法恢复，是否继续？', '注意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const res: any = await api.post('/project/cancelTender', { tender_id: activeTenderData.value.tender_id })
    if (res && res.code === 0) {
      ElMessage({ type: 'success', message: '已取消' })
      back()
    }
  }).catch(console.log)
}

const checkCancel = computed(() => {
  return isOwn.value && checkAuth('PM00101014')
    && (status.value === 3 || status.value === 4)
})

const checkRecreate = computed(() => {
  return isOwn.value && checkAuth('PM00101004')
    && (status.value === 3 || status.value === 4)
})

const checkRegisterResult = computed(() => {
  return isOwn.value && checkAuth('PM00101006')
    && (status.value === 5)
})
</script>

<template>
  <div v-loading="loading">
    <div v-if="activeTenderData.tender_id" class="block">
      <div class="top-button">
        <el-button v-if="checkCancel" type="primary" @click="cancel">
          取消投标
        </el-button>
        <el-button
          v-if="checkRecreate" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/project-bidding/bidding', r: true })"
        >
          重新发起投标
        </el-button>
        <el-button
          v-if="checkRegisterResult" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/register-bid/bid' })"
        >
          登记投标结果
        </el-button>
      </div>
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="项目名称：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="项目类型：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_type }}
        </el-descriptions-item>
        <el-descriptions-item label="投标类型：">
          {{ activeTenderData && (activeTenderData as resTenderI).purchase_way }}
        </el-descriptions-item>
        <el-descriptions-item label="是否联合体投标：">
          {{ activeTenderData && (activeTenderData as resTenderI).joint_bid === 1 ? '是' : '否' }}
        </el-descriptions-item>
        <el-descriptions-item label="保证金金额（万元）：">
          {{ activeTenderData && (activeTenderData as resTenderI).earnest_money }} 万元
        </el-descriptions-item>
        <el-descriptions-item label="项目所在地：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_dependency_country }}
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_dependency_province }}
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_dependency_city }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions>
        <el-descriptions-item label="项目等级与规模：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_general }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions>
        <el-descriptions-item label="项目实施方案：">
          {{ activeProjectData && (activeTenderData as resTenderI).implement_solution }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" style="margin-bottom: 20px;">
        <el-descriptions-item label="招标人：">
          {{ activeTenderData && (activeTenderData as resTenderI).tenderee }}
        </el-descriptions-item>
        <el-descriptions-item label="采购方式：">
          {{ activeTenderData && (activeTenderData as resTenderI).purchase_way }}
        </el-descriptions-item>
        <el-descriptions-item label="招标主体单位：">
          {{ activeTenderData && (activeTenderData as resTenderI).main_bidder }}
        </el-descriptions-item>
        <el-descriptions-item label="报名日期：">
          {{ activeTenderData && (activeTenderData as resTenderI).apply_time }}
        </el-descriptions-item>
        <el-descriptions-item label="交标日期：">
          {{ activeTenderData && (activeTenderData as resTenderI).receip_time }}
        </el-descriptions-item>
        <el-descriptions-item label="开标日期：">
          {{ activeTenderData && (activeTenderData as resTenderI).opentender_time }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人：">
          {{ activeTenderData && (activeTenderData as resTenderI).applicant_user }}
        </el-descriptions-item>
        <el-descriptions-item label="申请时间：">
          {{ activeTenderData && (activeTenderData as resTenderI).applicant_time }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="授权信息" :column="2" style="margin-bottom: 20px;">
        <el-descriptions-item label="授权人姓名：">
          {{ activeTenderData && (activeTenderData as resTenderI).authorized_person }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号码：">
          {{ activeTenderData && (activeTenderData as resTenderI).authorized_person_code }}
        </el-descriptions-item>
        <el-descriptions-item label="授权截止日期：">
          {{ activeTenderData && (activeTenderData as resTenderI).authorized_end_time }}
        </el-descriptions-item>
        <el-descriptions-item label="附件：">
          <el-button
            link type="primary"
            @click="downloadItem((activeTenderData as resTenderI).authorized_attachment_url as string)"
          >
            {{ activeTenderData && (activeTenderData as resTenderI).authorized_attachment_name }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="投标结果信息" :column="2" style="margin-bottom: 20px;">
        <el-descriptions-item label="投标结果：">
          {{ activeTenderData && (activeTenderData as resTenderI).tender_result }}
        </el-descriptions-item>
        <el-descriptions-item label="中标单位：">
          {{ activeTenderData && (activeTenderData as resTenderI).win_bidder }}
        </el-descriptions-item>
        <el-descriptions-item label="中标日期：">
          {{ activeTenderData && (activeTenderData as resTenderI).win_time }}
        </el-descriptions-item>
        <el-descriptions-item label="中标价格（万元）：">
          {{ activeTenderData && (activeTenderData as resTenderI).tender_money }}
        </el-descriptions-item>
        <el-descriptions-item label="投标报价清单：">
          <el-button
            link type="primary"
            @click="downloadItem((activeTenderData as resTenderI).tender_offer_url as string)"
          >
            {{ activeTenderData && (activeTenderData as resTenderI).tender_offer_name }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="中标通知书：">
          <el-button
            link type="primary"
            @click="downloadItem((activeTenderData as resTenderI).win_tender_inform_url as string)"
          >
            {{ activeTenderData && (activeTenderData as resTenderI).win_tender_inform_name }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="标书信息" :column="1" style="margin-bottom: 20px;" class="block-text">
        <el-descriptions-item label="标书文件：">
          <el-button
            link type="primary"
            @click="downloadItem((activeTenderData as resTenderI).tender_documents_url as string)"
          >
            {{ activeTenderData && (activeTenderData as resTenderI).tender_documents_name }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="备注：">
          {{ activeTenderData && (activeTenderData as resTenderI).tender_documents_note }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-if="(activeTenderData as resProjectDataI).approve_id"
        ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px"
        style="margin-bottom: 20px;"
      >
        <el-descriptions v-loading="approveLoading" title="审核信息" :column="1">
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
      <ApproveList v-if="activeTenderData.tender_approve.length" :conre-approve="activeTenderData.tender_approve" />
    </div>
    <el-empty v-else />
  </div>
</template>

<style scoped lang="scss">
@import './tab-comp-style';
</style>
