<script setup lang="ts">
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { getProject } from '@/views/operate/bid-method'
import type { approveFormDataI } from '@/views/operate/project-method'
import {
  activeProjectData, approveSubmit,
  downloadItem, resProjectDataI, rules,
} from '@/views/operate/project-method'
import api from '@/api'
import { back } from '@/views/scientific_research/project-method'
import { checkAuth, checkIsOwn, findLastAppItem } from '@/utils/tools'
import ApproveList from '@/views/operate/components/approve-list.vue'

const props = defineProps<{
  projectId: string
}>()
const emit = defineEmits(['goRouter'])
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()
const formData: approveFormDataI = reactive<approveFormDataI>({
  approve_contents: '',
  approve_id: '',
})
const getDetail = async () => {
  loading.value = true
  const data = await getProject(props.projectId)
  activeProjectData.value = data as resProjectDataI
  if (!data) {
    ElMessage.error('项目id不存在')
    setTimeout(() => location.reload(), 330)
    setTimeout(() => back(), 300)
    return
  }
  if (data && data.approve_id) formData.approve_id = data.approve_id
  loading.value = false
}
getDetail()

const cancelActive = () => {
  ElMessageBox.confirm(
    '点击确定后将无法恢复该项目，是否继续？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(async () => {
    const res: any = await api.post('/project/cancelProject', { project_id: props.projectId })
    if (res && res.code === 0) {
      ElMessage({
        type: 'success',
        message: '项目已取消',
      })
      back()
    }
  }).catch(console.log)
}

const end = async () => {
  ElMessageBox.confirm('是否完结该项目？', '注意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    loading.value = true
    const res: any = await api.post('/project/endProject', { project_id: props.projectId })
    if (!res || res.code !== 0) {
      loading.value = false
      return
    }
    emit('goRouter', { projectId: props.projectId, url: '/project-initiation/project-list' })
    loading.value = false
  }).catch(console.log)
}

const checkCancel = () => {
  const isOwn = checkIsOwn(activeProjectData.value.registrant_user)
  const last = findLastAppItem(activeProjectData.value.project_approve)
  const isAuth = checkAuth('PM00101013')
  return isOwn && last && isAuth && (last.approve_result === '等待审核' || last.approve_result === '驳回')
}

const checkReStart = () => {
  const isAuth = checkAuth('PM00101001')
  const last = findLastAppItem(activeProjectData.value.project_approve)
  return last && isAuth && (last.approve_result === '驳回' || last.approve_result !== '通过')
}

const checkFinish = () => {
  const isOwn = checkIsOwn(activeProjectData.value.registrant_user)
  return isOwn && checkAuth('PM00101012')
}
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <div class="top-button">
        <el-button v-if="checkCancel()" type="primary" @click="cancelActive">
          取消
        </el-button>
        <el-button
          v-if="checkReStart()" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/project-approval/approval' })"
        >
          重新发起
        </el-button>
        <el-button
          v-auth="['PM00101011']" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/tracking-information/tracking' })"
        >
          跟踪记录
        </el-button>
        <el-button
          v-auth="['PM00101004']" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/project-bidding/bidding' })"
        >
          新建投标评审
        </el-button>
        <el-button
          v-auth="['PM00101007']" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/contract-rating/contract-review' })"
        >
          合同评审
        </el-button>
        <el-button v-if="checkFinish()" type="primary" @click="end">
          项目完结
        </el-button>
      </div>
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="项目名称：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="项目编码：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_code }}
        </el-descriptions-item>
        <el-descriptions-item label="行业类型：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).industry_type }}
        </el-descriptions-item>
        <el-descriptions-item label="项目类型：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_type }}
        </el-descriptions-item>
        <el-descriptions-item label="预计标的：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).expect_amount }} 万元
        </el-descriptions-item>
        <el-descriptions-item label="业主/甲方单位：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).proprietor_customer }}
        </el-descriptions-item>
        <el-descriptions-item label="甲方联系人：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).proprietor_linkman }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人电话：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).proprietor_linkman_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="项目属地：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_dependency_country }}
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_dependency_province }}
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_dependency_city }}
        </el-descriptions-item>
        <el-descriptions-item label="商务合作伙伴：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).business_partner }}
        </el-descriptions-item>
        <el-descriptions-item label="商务合作伙伴电话：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).business_partner_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="经营负责人：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).operation_user }}
        </el-descriptions-item>
        <el-descriptions-item label="所属经营单位：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).operation_department }}
        </el-descriptions-item>
        <el-descriptions-item label="生产负责人：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).production_user }}
        </el-descriptions-item>
        <el-descriptions-item label="所属生产部门：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).production_department }}
        </el-descriptions-item>
        <el-descriptions-item label="备案登记人：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).registrant_user }}
        </el-descriptions-item>
        <el-descriptions-item label="备案登记时间：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).registration_time }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="项目概况：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).project_general }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="其他事项说明：">
          {{ activeProjectData && (activeProjectData as resProjectDataI).others }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-bottom: 20px;" title="" :column="1">
        <el-descriptions-item label="附件：">
          <el-button
            link type="primary"
            @click="downloadItem((activeProjectData as resProjectDataI).attachment_url as string)"
          >
            {{ activeProjectData && (activeProjectData as resProjectDataI).attachment_name }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-if="activeProjectData && (activeProjectData as resProjectDataI).approve_id"
        ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px"
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
      <ApproveList v-if="activeProjectData.project_approve.length" :conre-approve="activeProjectData.project_approve" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./tab-comp-style";
</style>
