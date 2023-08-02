<script lang="ts" setup>
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import {
  addProject, clearFormData,
  customerOptions, formData, getCustomerHandle, handleUploadFile,
  loading, searchLoading,
} from '@/views/operate/approval-method'
import { primaryIndustryTypeOptions } from '@/views/production/project-method'
import { primaryBusinessOptions } from '@/views/operate/customer-method'
import { getTreeList, getUserList, level3List } from '@/views/system/personnel-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'
import { getProject } from '@/views/operate/bid-method'
import { baseURL } from '@/api'

const route = useRoute()
const query = route.query
const userList = ref([])
const initUserList = async () => userList.value = await getUserList()
initUserList()
getTreeList()
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  project_name: [{ required: true, message: '输入项目名称', trigger: 'blur' }],
  project_code: [{ required: true, message: '输入项目编码', trigger: 'blur' }],
  proprietor_linkman: [{ required: true, message: '输入联系人', trigger: 'blur' }],
  proprietor_linkman_phone: [
    { required: true, message: '输入电话', trigger: 'blur' },
    { min: 11, max: 11, message: '输入正确手机号', trigger: ['blur', 'change'] },
  ],
  business_partner_phone: [
    { min: 11, max: 11, message: '输入正确手机号', trigger: ['blur', 'change'] },
  ],
  project_general: [{ required: true, message: '输入项目概况', trigger: 'blur' }],
  industry_type: [{ required: true, message: '选择类型', trigger: 'change' }],
  project_type_arr: [{ required: true, message: '选择类型', trigger: 'change' }],
  proprietor_customer_id: [{ required: true, message: '选择业主/甲方单位', trigger: 'change' }],
  project_dependency_country: [{ required: true, message: '选择地址', trigger: 'change' }],
  pcas: [{ required: true, message: '选择地址', trigger: 'change' }],
  operation_user_id: [{ required: true, message: '选择人员', trigger: 'change' }],
  operation_department_id: [{ required: true, message: '选择单位', trigger: 'change' }],
})
const router = useRouter()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      formData.project_type = formData.project_type_arr!.join(',')
      formData.project_dependency_province = (formData.pcas as string[])[0]
      formData.project_dependency_city = (formData.pcas as string[])[1]
      // delete formData.pcas
      // delete formData.fileList
      // delete formData.project_type_arr
      loading.value = true
      if (query.project_id) {
        formData.project_id = query.project_id as string
        const res: any = await addProject(formData)
        if (res && res.code !== 0) {
          loading.value = false
          return
        }
      } else {
        delete formData.project_id
        const res: any = await addProject(formData)
        if (res && res.code !== 0) {
          loading.value = false
          return
        }
      }
      loading.value = false
      clearFormData()
      await router.push('/project-initiation/project-list')
    }
  })
}
const initProject = async (id: string) => {
  const res = await getProject(id)
  formData.project_name = res.project_name
  formData.project_general = res.project_general
  formData.project_code = res.project_code
  formData.project_type = ''
  formData.project_type_arr = res.project_type.split(',')
  formData.project_dependency_country = res.project_dependency_country
  formData.project_dependency_province = ''
  formData.project_dependency_city = ''
  formData.industry_type = res.industry_type
  formData.expect_amount = res.expect_amount
  formData.proprietor_customer_id = res.proprietor_customer_id
  formData.proprietor_linkman = res.proprietor_linkman
  formData.proprietor_linkman_phone = res.proprietor_linkman_phone.toString()
  formData.business_partner = res.business_partner
  formData.business_partner_phone = res.business_partner_phone.toString()
  formData.operation_department_id = res.operation_department_id
  formData.operation_user_id = res.operation_user_id
  formData.production_department_id = res.production_department_id
  formData.production_user_id = res.production_user_id
  formData.attachment = res.attachment
  formData.others = res.others
  formData.pcas = [res.project_dependency_province, res.project_dependency_city]
  if (res.attachment_url) {
    formData.fileList = [{
      name: res.attachment_name,
      url: baseURL + res.attachment_url.slice(4),
    }]
  }
}
if (query.project_id) initProject(query.project_id as string)
else clearFormData()
getCustomerHandle('')
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          项目备案申请单
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
          <el-form-item label="项目名称：" prop="project_name">
            <el-input v-model="formData.project_name" />
          </el-form-item>
          <el-form-item label="项目编码：" prop="project_code">
            <el-input v-model="formData.project_code" />
          </el-form-item>
          <el-form-item label="行业类型：" prop="industry_type">
            <el-select v-model="formData.industry_type">
              <el-option v-for="ind in primaryIndustryTypeOptions" :key="ind" :label="ind" :value="ind" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目类型：" prop="project_type_arr">
            <el-select
              v-model="formData.project_type_arr" multiple collapse-tags collapse-tags-tooltip
              :max-collapse-tags="2"
            >
              <el-option v-for="bus in primaryBusinessOptions" :key="bus" :label="bus" :value="bus" />
            </el-select>
          </el-form-item>
          <el-form-item label="预计标的（万元）：">
            <el-input-number v-model="formData.expect_amount" controls-position="right" />
          </el-form-item>
          <el-form-item label="业主/甲方单位：" prop="proprietor_customer_id">
            <el-select
              v-model="formData.proprietor_customer_id" filterable remote reserve-keyword placeholder="输入名称查找"
              :remote-method="getCustomerHandle" :loading="searchLoading"
            >
              <el-option
                v-for="p in customerOptions" :key="p.customer_id" :label="p.customer_name"
                :value="p.customer_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="甲方联系人：" prop="proprietor_linkman">
            <el-input v-model="formData.proprietor_linkman" />
          </el-form-item>
          <el-form-item label="联系人电话：" prop="proprietor_linkman_phone">
            <el-input v-model="formData.proprietor_linkman_phone" />
          </el-form-item>
          <el-form-item label="商务合作伙伴：">
            <el-input v-model="formData.business_partner" />
          </el-form-item>
          <el-form-item label="商务合作伙伴联系电话：" prop="business_partner_phone">
            <el-input v-model="formData.business_partner_phone" />
          </el-form-item>
          <el-form-item label="国家：" prop="project_dependency_country">
            <el-select v-model="formData.project_dependency_country">
              <el-option label="国内" value="国内" />
              <el-option label="国外" value="国外" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.project_dependency_country === '国内'" label="地区：" prop="pcas">
            <pcas-cascader v-model="formData.pcas" type="pc" format="name" />
          </el-form-item>
          <el-form-item label="经营负责人：" prop="operation_user_id">
            <el-select v-model="formData.operation_user_id">
              <el-option v-for="item in userList" :key="item.user_id" :label="item.user_name" :value="item.user_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属经营单位：" prop="operation_department_id">
            <el-select v-model="formData.operation_department_id">
              <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="生产负责人：">
            <el-select v-model="formData.production_user_id" clearable>
              <el-option v-for="item in userList" :key="item.user_id" :label="item.user_name" :value="item.user_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属生产单位：" prop="production_department_id">
            <el-select v-model="formData.production_department_id" clearable>
              <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目概况：" prop="project_general">
            <el-input
              v-model="formData.project_general" maxlength="800" type="textarea" :rows="6"
              placeholder="请输入不少于100字，不多于800字以内的项目概况信息，如（项目总规模及我司承接工作内容、规模、等级等）"
            />
          </el-form-item>
          <el-form-item label="其他事项说明：">
            <el-input
              v-model="formData.others" maxlength="800" type="textarea" :rows="6"
              placeholder="其他事项说明"
            />
          </el-form-item>
          <div>
            <el-form-item label="附件上传：" prop="fileList">
              <!-- eslint-disable-next-line -->
              <el-upload v-model:file-list="formData.fileList as UploadUserFile[]" action="" accept=".jpg,.jpeg,.png"
                         :http-request="handleUploadFile"
                         :before-upload="() => beforeUploadFile(formData.attachment as string)"
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
    width: 980px;
  }

  .more-box {
    margin-left: 120px;
    margin-top: 20px;

    .po-item {
      margin-top: 10px;
      border-top: 1px solid #cfcfcf;
      padding-top: 10px;
      position: relative;

      .op-icon {
        position: absolute;
        cursor: pointer;
        right: 10px;
        top: 10px;
        color: #c0c0c0;
      }
    }
  }
}
</style>
