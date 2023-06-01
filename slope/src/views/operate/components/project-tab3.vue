<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import type {
  approveFormDataI,
} from '@/views/operate/project-method'

import { getTender } from '@/views/operate/bid-method'
import {
  activeProjectData, activeTenderData, approveSubmit,
  downloadItem, resProjectDataI, resTenderI, rules,
} from '@/views/operate/project-method'
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
const getDetail = async () => {
  loading.value = true
  const data = await getTender(props.projectId)
  activeTenderData.value = data as resTenderI
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
          取消投标
        </el-button>
        <el-button type="primary" @click="() => emit('goRouter', { projectId: props.projectId, url: '/project-bidding/bidding' })">
          重新发起投标
        </el-button>
        <el-button type="primary" @click="() => emit('goRouter', { projectId: props.projectId, url: '/register-bid/bid' })">
          登记投标结果
        </el-button>
      </div>
      <el-descriptions title="基本信息" :column="2">
        <el-descriptions-item label="项目名称：">
          {{ (activeProjectData as resProjectDataI).project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="项目类型：">
          {{ (activeProjectData as resProjectDataI).project_type }}
        </el-descriptions-item>
        <el-descriptions-item label="投标类型：">
          {{ (activeTenderData as resTenderI).purchase_way }}
        </el-descriptions-item>
        <el-descriptions-item label="是否联合体投标：">
          {{ (activeTenderData as resTenderI).joint_bid === 1 ? '是' : '否' }}
        </el-descriptions-item>
        <el-descriptions-item label="保证金金额：">
          {{ (activeTenderData as resTenderI).earnest_money }} 万元
        </el-descriptions-item>
        <el-descriptions-item label="项目所在地：">
          {{ (activeProjectData as resProjectDataI).project_dependency_country }}
          {{ (activeProjectData as resProjectDataI).project_dependency_province }}
          {{ (activeProjectData as resProjectDataI).project_dependency_city }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions>
        <el-descriptions-item label="项目概况：">
          {{ (activeProjectData as resProjectDataI).project_general }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" style="margin-bottom: 20px;">
        <el-descriptions-item label="招标人：">
          {{ (activeTenderData as resTenderI).tenderee }}
        </el-descriptions-item>
        <el-descriptions-item label="招标主体单位：">
          {{ (activeTenderData as resTenderI).main_bidder }}
        </el-descriptions-item>
        <el-descriptions-item label="报名日期：">
          {{ (activeTenderData as resTenderI).apply_time }}
        </el-descriptions-item>
        <el-descriptions-item label="交标日期：">
          {{ (activeTenderData as resTenderI).receip_time }}
        </el-descriptions-item>
        <el-descriptions-item label="开标日期：">
          {{ (activeTenderData as resTenderI).opentender_time }}
        </el-descriptions-item>
        <el-descriptions-item label="申请人：">
          {{ (activeTenderData as resTenderI).applicant_user }}
        </el-descriptions-item>
        <el-descriptions-item label="申请时间：">
          {{ (activeTenderData as resTenderI).applicant_time }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="授权信息" :column="2" style="margin-bottom: 20px;">
        <el-descriptions-item label="授权人姓名：">
          {{ (activeTenderData as resTenderI).authorized_attachment_name }}
        </el-descriptions-item>
        <el-descriptions-item label="身份证号码：">
          {{ (activeTenderData as resTenderI).authorized_person_code }}
        </el-descriptions-item>
        <el-descriptions-item label="授权截止日期：">
          {{ (activeTenderData as resTenderI).authorized_end_time }}
        </el-descriptions-item>
        <el-descriptions-item label="附件：">
          <el-button
            link type="primary"
            @click="downloadItem((activeTenderData as resTenderI).authorized_attachment_url as string)"
          >
            {{ (activeTenderData as resTenderI).authorized_attachment_name }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-form
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
          v-for="(item, index) in (activeTenderData as resTenderI).tender_approve"
          :key="index" label="审核人："
        >
          审核人： {{ item.approve_user }} (<span>{{ item.approve_result }}</span>)
          <div style="margin: 10px 0;">
            {{ item.approve_contents }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './tab-comp-style';
</style>