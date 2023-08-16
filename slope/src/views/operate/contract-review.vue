<script setup lang="ts">
import { ElMessage, FormInstance, FormRules, UploadUserFile } from 'element-plus'
import {
  addContractReview,
  clearFormData,
  formData,
  handleUploadFile,
  loading,
} from '@/views/operate/contract-review-methods'
import { projectIdSelect, projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'
import { getProject, selectBlur, selectChange } from '@/views/operate/bid-method'
import { getTreeList, level2List } from '@/views/system/personnel-method'
import { customerOptions, getCustomerHandle, searchLoading } from '@/views/operate/approval-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'
import { getContractReview } from '@/views/operate/project-method'
import { baseURL } from '@/api'

getTreeList()
remoteMethod('', {})
getCustomerHandle('')
const route = useRoute()
const query = route.query
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // delete formData.fileList
      const res: any = await addContractReview(formData)
      console.log(res)
      if (!res || res.code !== 0) {
        loading.value = false
        return
      }
      // formData.attachment = ''
      await router.push(`/project-initiation/project-detail?project_id=${ formData.project_id }&type=2`)
      clearFormData()
      // ruleFormRef.value!.clearValidate()
      loading.value = false
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
// getPersonData()
const selectProject = async (projectId: string) => {
  const data = await getProject(projectId)
  console.log(data.project_status)
  if (data.project_status !== 2 && data.project_status !== 8 && data.project_status !== 9 && data.project_status !== 10) {
    ElMessage.error('该项目不可发起合同评审')
    clearFormData()
    return false
  }
  return true
}

const initForm = async (id: string) => {
  const data = await getContractReview(id)
  formData.contract_name = data.contract_name
  formData.contract_number = data.contract_number
  formData.first_party = data.first_party
  formData.second_party = data.second_party
  formData.contract_money = data.contract_money
  formData.contract_type = data.contract_type
  // formData.responsible_person = data.responsible_person
  formData.contract_general = data.contract_general
  formData.attention = data.attention
  if (data.attachment) {
    formData.attachment = data.attachment
    formData.fileList = [{
      name: data.attachment_name,
      url: baseURL + data.attachment_url.slice(4),
    }]
  }
}

const initData = async () => {
  const id = query.project_id as string
  if (id) {
    const check = await selectProject(id)
    if (!check) return
    await projectIdSelect(id)
    formData.project_id = id
    if (query.r === 'true') {
      await initForm(id)
    }
  } else clearFormData()
}
initData()
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          合同评审
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
              disabled :remote-method="remoteMethod" :loading="projectSearchLoading"
              @change="selectProject"
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
          <el-form-item label="合同金额（万元）：" prop="contract_money">
            <el-input-number v-model="formData.contract_money" controls-position="right" />
          </el-form-item>
          <el-form-item label="合同类型：" prop="contract_type">
            <el-select v-model="formData.contract_type" clearable>
              <el-option label="自营" value="自营" />
              <el-option label="挂靠" value="挂靠" />
              <el-option label="科研" value="科研" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="经办人：" prop="responsible_person">
            <el-select v-model="formData.responsible_person" placeholder="选择人员">
              <el-option v-for="p in personList" :key="p.user_id" :label="p.user_name" :value="p.user_name" />
            </el-select>
          </el-form-item> -->
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
