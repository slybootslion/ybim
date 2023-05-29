<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import {
  addTender, clearFormData, editId,
  formData, handleUploadFile, loading, primaryPurchaseWayOptions,
} from '@/views/operate/bidding-method'
import { projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'
import { getTreeList, level2List } from '@/views/system/personnel-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'

getTreeList()
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  authorized_end_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  apply_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  receip_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  opentender_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  applicant_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  purchase_way: [{ required: true, message: '选择方式', trigger: 'change' }],
  joint_bid: [{ required: true, message: '选择有无联合体', trigger: 'blur' }],
  earnest_money: [{ required: true, message: '输入保证金金额', trigger: 'blur' }],
  tenderee: [{ required: true, message: '输入招标人', trigger: 'blur' }],
  main_bidder: [{ required: true, message: '输入主体单位', trigger: 'blur' }],
  authorized_person: [{ required: true, message: '输入姓名', trigger: 'blur' }],
  authorized_person_code: [{ required: true, message: '输入身份号码', trigger: 'blur' }],
  fileList: [{ required: true, message: '上传附件', trigger: 'change' }],
})
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      formData.joint_bid = +formData.joint_bid
      if (formData.joint_bid === 0) delete formData.joint_company
      delete formData.fileList
      if (!editId.value) {
        const res: any = await addTender(formData)
        if (res.code !== 0) {
          loading.value = false
          return
        }
      } else {
        console.log('edit')
      }
      clearFormData()
      loading.value = false
    }
  })
}
remoteMethod('')
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          项目投标申请
        </div>
        <div>
          <el-button type="primary" @click="submit(ruleFormRef as FormInstance)">
            提交
          </el-button>
        </div>
      </div>
    </page-main>
    <page-main class="page-main">
      <div class="block">
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="140px">
          <div class="block-title">
            基本信息
          </div>
          <el-form-item label="项目名称：" prop="project_id">
            <el-select
              v-model="formData.project_id" filterable remote reserve-keyword placeholder="输入项目名称查找"
              :remote-method="remoteMethod" :loading="projectSearchLoading"
            >
              <el-option
                v-for="p in projectOptions" :key="p.project_id" :label="p.project_name"
                :value="p.project_id"
              />
            </el-select>
          </el-form-item>
          <div>
            <el-form-item label="是否联合体投标：" prop="joint_bid">
              <el-switch v-model="formData.joint_bid" />
            </el-form-item>
            <el-form-item v-if="formData.joint_bid" label="联合体单位：">
              <el-input v-model="formData.joint_company" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="保证金类型：" prop="earnest_type">
              <el-select v-model="formData.earnest_type">
                <el-option label="现金" value="现金" />
                <el-option label="保函" value="保函" />
              </el-select>
            </el-form-item>
            <el-form-item label="保证金金额：" prop="earnest_money">
              <el-input-number v-model="formData.earnest_money" controls-position="right" />
            </el-form-item>
          </div>
          <el-form-item label="项目等级与规模：">
            <el-input v-model="formData.grade_scale" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
          <div>
            <el-form-item label="招标人：" prop="tenderee">
              <el-input v-model="formData.tenderee" />
            </el-form-item>
            <el-form-item label="投标主体单位：" prop="main_bidder">
              <el-select v-model="formData.main_bidder" placeholder="选择部门">
                <el-option v-for="item in level2List" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="招标代理机构：" prop="tender_agent">
              <el-input v-model="formData.tender_agent" />
            </el-form-item>
            <el-form-item label="采购方式：" prop="purchase_way">
              <el-select v-model="formData.purchase_way">
                <el-option v-for="ind in primaryPurchaseWayOptions" :key="ind" :label="ind" :value="ind" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="项目实施方案：">
            <el-input v-model="formData.implement_solution" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
          <div>
            <el-form-item label="报名日期：" prop="apply_time">
              <el-date-picker v-model="formData.apply_time" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
            <el-form-item label="交标日期：" prop="receip_time">
              <el-date-picker v-model="formData.receip_time" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
            <el-form-item label="开标日期：" prop="opentender_time">
              <el-date-picker v-model="formData.opentender_time" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
            <el-form-item label="申请时间：" prop="applicant_time">
              <el-date-picker v-model="formData.applicant_time" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
          </div>
          <el-form-item label="特殊说明：">
            <el-input v-model="formData.specific_note" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
          <div class="block-title">
            授权信息
          </div>
          <el-form-item label="授权人姓名：" prop="authorized_person">
            <el-input v-model="formData.authorized_person" />
          </el-form-item>
          <el-form-item label="身份证号码：" prop="authorized_person_code">
            <el-input v-model="formData.authorized_person_code" />
          </el-form-item>
          <el-form-item label="授权截止日期：" prop="authorized_end_time">
            <el-date-picker v-model="formData.authorized_end_time" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <div>
            <el-form-item label="附件上传：" prop="fileList">
              <!-- eslint-disable-next-line -->
              <el-upload v-model:file-list="formData.fileList as UploadUserFile[]" action="" accept=".jpg,.jpeg,.png"
                         :http-request="handleUploadFile"
                         :before-upload="() => beforeUploadFile(formData.authorized_attachment as string)"
                         :on-remove="() => handleRemoveFile(formData, 'authorized_attachment')"
              >
                <el-button type="primary">
                  上传
                </el-button>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </page-main>
  </div>
</template>

<style scoped lang="scss">
.page-main {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .block-title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 20px;
  }

  :deep(.el-input),
  :deep(.el-cascader),
  :deep(.el-switch),
  :deep(.el-input-number),
  :deep(.el-select) {
    width: 220px !important;
  }

  :deep(.el-textarea) {
    width: 860px;
  }
}
</style>
