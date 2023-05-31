<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { getProject } from '@/views/operate/bid-method'
import type { approveFormDataI } from '@/views/operate/project-method'
import {
  activeProjectData, approveSubmit,
  downloadItem, resProjectDataI, rules,
} from '@/views/operate/project-method'

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
  formData.approve_id = data.approve_id
  loading.value = false
}
getDetail()
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <div class="top-button">
        <el-button type="primary">
          取消
        </el-button>
        <el-button type="primary" @click="() => emit('goRouter', { projectId: props.projectId, url: '/project-approval/approval' })">
          重新发起
        </el-button>
        <el-button type="primary" @click="() => emit('goRouter', { projectId: props.projectId, url: '/tracking-information/tracking' })">
          跟踪记录
        </el-button>
        <el-button type="primary" @click="() => emit('goRouter', { projectId: props.projectId, url: '/project-bidding/bidding' })">
          新建投标评审
        </el-button>
        <el-button type="primary" @click="() => emit('goRouter', { projectId: props.projectId, url: '/contract-rating/contract-review' })">
          合同评审
        </el-button>
        <el-button type="primary">
          项目完结
        </el-button>
      </div>
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="项目名称：">
          {{ (activeProjectData as resProjectDataI).project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="项目编码：">
          {{ (activeProjectData as resProjectDataI).project_code }}
        </el-descriptions-item>
        <el-descriptions-item label="行业类型：">
          {{ (activeProjectData as resProjectDataI).industry_type }}
        </el-descriptions-item>
        <el-descriptions-item label="项目类型：">
          {{ (activeProjectData as resProjectDataI).project_type }}
        </el-descriptions-item>
        <el-descriptions-item label="预计标的：">
          {{ (activeProjectData as resProjectDataI).expect_amount }} 万元
        </el-descriptions-item>
        <el-descriptions-item label="业主/甲方单位：">
          {{ (activeProjectData as resProjectDataI).proprietor_customer }}
        </el-descriptions-item>
        <el-descriptions-item label="甲方联系人：">
          {{ (activeProjectData as resProjectDataI).proprietor_linkman }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人电话：">
          {{ (activeProjectData as resProjectDataI).proprietor_linkman_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="项目属地：">
          {{ (activeProjectData as resProjectDataI).project_dependency_country }}
          {{ (activeProjectData as resProjectDataI).project_dependency_province }}
          {{ (activeProjectData as resProjectDataI).project_dependency_city }}
        </el-descriptions-item>
        <el-descriptions-item label="商务合作伙伴：">
          {{ (activeProjectData as resProjectDataI).business_partner }}
        </el-descriptions-item>
        <el-descriptions-item label="商务合作伙伴电话：">
          {{ (activeProjectData as resProjectDataI).business_partner_phone }}
        </el-descriptions-item>
        <el-descriptions-item label="经营负责人：">
          {{ (activeProjectData as resProjectDataI).operation_user }}
        </el-descriptions-item>
        <el-descriptions-item label="所属经营单位：">
          {{ (activeProjectData as resProjectDataI).operation_department }}
        </el-descriptions-item>
        <el-descriptions-item label="生产负责人：">
          {{ (activeProjectData as resProjectDataI).production_user }}
        </el-descriptions-item>
        <el-descriptions-item label="所属生产部门：">
          {{ (activeProjectData as resProjectDataI).production_department }}
        </el-descriptions-item>
        <el-descriptions-item label="备案登记人：">
          {{ (activeProjectData as resProjectDataI).registrant_user }}
        </el-descriptions-item>
        <el-descriptions-item label="备案登记时间：">
          {{ (activeProjectData as resProjectDataI).registration_time }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="" :column="1">
        <el-descriptions-item label="项目概况：">
          {{ (activeProjectData as resProjectDataI).project_general }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-bottom: 20px;" title="" :column="1">
        <el-descriptions-item label="附件：">
          <el-button
            link type="primary"
            @click="downloadItem((activeProjectData as resProjectDataI).attachment_url as string)"
          >
            {{ (activeProjectData as resProjectDataI).attachment_name }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px">
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
      <el-descriptions style="margin-top: 20px;" title="审核信息" :column="1">
        <el-descriptions-item
          v-for="(item, index) in (activeProjectData as resProjectDataI).project_approve"
          :key="index" label="审核人："
        >
          审核人： {{ item.approve_user }} (<span>{{ item.approve_result }}</span>)
          <div style="margin-top: 5px; margin-bottom: 10px;">
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
