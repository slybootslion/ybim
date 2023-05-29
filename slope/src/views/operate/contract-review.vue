<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import {
  addContractReview,
  clearFormData,
  editId,
  formData,
  handleUploadFile,
  loading,
} from '@/views/operate/contract-review-methods'
import { projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'
import { selectBlur, selectChange } from '@/views/operate/bid-method'
import { getTreeList, level2List } from '@/views/system/personnel-method'
import { customerOptions, getCustomerHandle, searchLoading } from '@/views/operate/approval-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'

getTreeList()
getCustomerHandle('')
const ruleFormRef = ref<FormInstance>()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      delete formData.fileList
      if (!editId.value) {
        const res: any = await addContractReview(formData)
        if (!res || res.code !== 0) {
          loading.value = false
          return
        }
      } else {
        console.log('edit')
      }
      formData.attachment = ''
      loading.value = false
      clearFormData()
    }
  })
}
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  first_party: [{ required: true, message: '输入甲方', trigger: 'change' }],
  second_party: [{ required: true, message: '输入乙方', trigger: 'change' }],
  contract_name: [{ required: true, message: '输入名称', trigger: 'blur' }],
  contract_number: [{ required: true, message: '输入编号', trigger: 'blur' }],
  contract_money: [{ required: true, message: '输入金额', trigger: 'blur' }],
})
remoteMethod('')
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div>
          生产任务单
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
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="180px">
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
          <el-form-item label="合同名称：" prop="contract_name">
            <el-input v-model="formData.contract_name" />
          </el-form-item>
          <el-form-item label="合同编号：" prop="contract_number">
            <el-input v-model="formData.contract_number" />
          </el-form-item>
          <el-form-item label="甲方：" prop="first_party">
            <el-select
              v-model="formData.first_party" filterable remote reserve-keyword placeholder="输入名称查找"
              :remote-method="getCustomerHandle" :loading="searchLoading"
            >
              <el-option
                v-for="p in customerOptions" :key="p.customer_id" :label="p.customer_name"
                :value="p.customer_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="乙方：" prop="second_party">
            <el-select
              v-model="formData.second_party" filterable remote reserve-keyword placeholder="输入名称查找"
              :loading="projectSearchLoading"
              @blur="selectBlur" @change="selectChange"
            >
              <el-option v-for="item in level2List" :key="item.label" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="合同金额：" prop="contract_money">
            <el-input-number v-model="formData.contract_money" controls-position="right" />
          </el-form-item>
          <el-form-item label="合同类型：" prop="contract_type">
            <el-select v-model="formData.contract_type">
              <el-option label="自营" value="自营" />
              <el-option label="挂靠" value="挂靠" />
              <el-option label="科研" value="科研" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="经办人：" prop="responsible_person">
            <el-input v-model="formData.responsible_person" />
          </el-form-item>
          <el-form-item label="合同内容概述：" prop="contract_general">
            <el-input
              v-model="formData.contract_general" maxlength="200" type="textarea" :rows="3"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="需重点关注问题及其他必要情况说明：" prop="contract_general">
            <el-input
              v-model="formData.attention" maxlength="200" type="textarea" :rows="3"
              placeholder=""
            />
          </el-form-item>
          <div>
            <el-form-item label="附件：">
              <!-- eslint-disable-next-line -->
              <el-upload v-model:file-list="formData.fileList as UploadUserFile[]" action=""
                         accept=".pdf,.jpg,.png,jpeg"
                         :http-request="handleUploadFile"
                         :before-upload="() => beforeUploadFile(formData.attachment)"
                         :on-remove="() => handleRemoveFile(formData, 'attachment')"
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

  :deep(.el-input-number),
  :deep(.el-input) {
    width: 260px !important;
    display: flex;
  }

  :deep(.el-textarea) {
    width: 1160px;
  }
}
</style>
