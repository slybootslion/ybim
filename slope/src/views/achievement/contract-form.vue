<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import {
  activeSubIndTypeOptions,
  addContract,
  clearFormData,
  editContract,
  editId,
  firstPartyKeyOption,
  firstPartyLabelOption,
  firstPartyOption,
  formData,
  getEditData,
  handleUploadFile,
  industryTypeChange,
  loading,
  paymentTypeChange, projectOptions,
  projectSearchLoading,
  remoteFirstPartyMethod,
  remoteMethod,
  remoteSecondPartyMethod,
  secondPartyKeyOption,
  secondPartyLabelOption,
  secondPartyOption,
} from '@/views/achievement/contract-method'
import { back } from '@/views/scientific_research/project-method'
import { level3List } from '@/views/system/personnel-method'
import { primaryIndustryTypeOptions } from '@/views/production/project-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'

const route = useRoute()
const query = route.query
if (!query.contract_id) clearFormData()
else getEditData(query.contract_id as string)

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  payment_type: [{ required: true, message: '选择收支类型', trigger: 'change' }],
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  first_party: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  industry_type: [{ required: true, message: '输入行业类型', trigger: 'change' }],
  second_party: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  operation_department_id: [{ required: true, message: '输入部门', trigger: 'change' }],
  contract_type: [{ required: true, message: '输入合同类型', trigger: 'change' }],
  sign_time: [{ required: true, message: '输入日期', trigger: 'change' }],
  rank_size: [{ required: true, message: '输入登记规模', trigger: 'change' }],
  contract_name: [{ required: true, message: '输入合同名称', trigger: 'blur' }],
  contract_number: [{ required: true, message: '输入合同编号', trigger: 'blur' }],
  contract_money: [{ required: true, message: '输入金额', trigger: 'blur' }],
  attention: [{ required: true, message: '输入金额', trigger: 'blur' }],
  project_scale: [{ required: true, message: '输入金额', trigger: 'blur' }],
  fileList: [{ required: true, message: '上传合同附件', trigger: 'change' }],
})

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // delete formData.fileList
      if (!editId.value) {
        const res: any = await addContract(formData)
        if (!res || res.code !== 0) {
          loading.value = false
          return
        }
      } else {
        formData.contract_id = editId.value
        const res: any = await editContract(formData)
        if (!res || res.data.code !== 0) {
          loading.value = false
          return
        }
      }
      loading.value = false
      back()
    }
  })
}

setTimeout(() => ruleFormRef.value!.clearValidate())
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          合同登记存档
        </div>
        <div>
          <el-button type="primary" @click="submit(ruleFormRef as FormInstance)">
            提交
          </el-button>
          <el-button @click="back">
            返回
          </el-button>
        </div>
      </div>
    </page-main>
    <page-main class="page-main">
      <div class="block">
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="180px">
          <div>
            <el-form-item label="收支类型：" prop="payment_type">
              <el-select v-model="formData.payment_type" @change="paymentTypeChange">
                <el-option label="收入" value="收入" />
                <el-option label="支出" value="支出" />
              </el-select>
            </el-form-item>
            <el-form-item label="合同类型：" prop="contract_type">
              <el-select v-model="formData.contract_type">
                <el-option label="自营" value="自营" />
                <el-option label="挂靠" value="挂靠" />
                <el-option label="科研" value="科研" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </div>
          <!--          <el-form-item v-if="formData.contract_type === '科研'" label="关联项目：" prop="project_id"> -->
          <!--            <el-select -->
          <!--              v-model="formData.project_id" filterable remote reserve-keyword placeholder="输入项目名称查找" -->
          <!--              :remote-method="remoteMethodSci" :loading="projectSearchLoading" -->
          <!--            > -->
          <!--              <el-option -->
          <!--                v-for="p in projectOptionsSci" :key="p.research_id" :label="p.research_name" -->
          <!--                :value="p.research_id" -->
          <!--              /> -->
          <!--            </el-select> -->
          <!--          </el-form-item> -->
          <el-form-item label="关联项目：" prop="project_id">
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
          <div>
            <el-form-item label="甲方：" prop="first_party">
              <el-select
                v-model="formData.first_party" filterable remote reserve-keyword placeholder="输入名称查找"
                :remote-method="remoteFirstPartyMethod" :loading="projectSearchLoading"
              >
                <el-option
                  v-for="p in firstPartyOption" :key="p[firstPartyKeyOption]"
                  :label="p[firstPartyLabelOption]" :value="p[firstPartyKeyOption]"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="乙方：" prop="second_party">
              <el-select
                v-model="formData.second_party" filterable remote reserve-keyword placeholder="输入名称查找"
                :remote-method="remoteSecondPartyMethod" :loading="projectSearchLoading"
              >
                <el-option
                  v-for="p in secondPartyOption" :key="p[secondPartyKeyOption]"
                  :label="p[secondPartyLabelOption]" :value="p[secondPartyKeyOption]"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="合同金额（万元）：" prop="contract_money">
            <el-input v-model="formData.contract_money" />
          </el-form-item>
          <el-form-item label="合同签订时间：" prop="sign_time">
            <el-date-picker v-model="formData.sign_time" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="合同所属部门：" prop="operation_department_id">
            <el-select v-model="formData.operation_department_id">
              <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="行业类型：" prop="industry_type">
            <el-select v-model="formData.industry_type" @change="industryTypeChange">
              <el-option v-for="ind in primaryIndustryTypeOptions" :key="ind" :label="ind" :value="ind" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeSubIndTypeOptions.length"
            label="等级规模：" prop="rank_size"
          >
            <el-select v-model="formData.rank_size">
              <el-option v-for="act in activeSubIndTypeOptions" :key="act" :label="act" :value="act" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目规模：">
            <el-input
              v-model="formData.project_scale" maxlength="800" type="textarea" :rows="5"
              placeholder="请输入项目总规模及我司承接工作内容、规模、等级等"
            />
          </el-form-item>
          <el-form-item label="需重点关注问题及其他必要情况说明：">
            <el-input
              v-model="formData.attention" maxlength="800" type="textarea" :rows="5"
              placeholder=""
            />
          </el-form-item>
          <div>
            <el-form-item label="合同附件：" prop="fileList">
              <!-- eslint-disable-next-line -->
              <el-upload v-model:file-list="formData.fileList as UploadUserFile[]" action="" accept=".pdf"
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

  :deep(.el-input) {
    width: 300px !important;
    display: flex;
  }

  :deep(.el-textarea) {
    width: 1060px;
  }
}
</style>
