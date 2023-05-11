<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import {
  formData, loading, primaryIndustryTypeOptions, primaryMajorTypeOption,
} from '@/views/production/project-method'
import { primaryBusinessOptions } from '@/views/operate/customer-method'

const ruleFormRef = ref<FormInstance>()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      console.log(valid)
    }
  })
}

const rules = reactive<FormRules>({
  customer_name: [{ required: true, message: '输入名称', trigger: 'blur' }],
  address_detail: [{ required: true, message: '输入详细地址', trigger: 'blur' }],
  primary_business_list: [{ required: true, message: '输入主营业务', trigger: 'change' }],
  pcas: [{ required: true, message: '输入地址', trigger: 'change' }],
  linkman: [{ required: true, message: '输入联系人', trigger: 'blur' }],
  linkman_phone: [{ required: true, message: '输入电话', trigger: 'blur' }],
  linkman_post: [{ required: true, message: '输入职务', trigger: 'blur' }],
  customer_general: [{ required: true, message: '输入客户概况', trigger: 'blur' }],
})
</script>

<template>
  <div v-loading="loading">
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
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px">
          <el-form-item label="关联项目：" prop="project_id">
            <el-input v-model="formData.project_id" />
          </el-form-item>
          <el-form-item label="行业类型：" prop="industry_type">
            <el-select v-model="formData.industry_type">
              <el-option v-for="ind in primaryIndustryTypeOptions" :key="ind" :label="ind" :value="ind" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目类型：" prop="project_type">
            <el-select v-model="formData.project_type">
              <el-option v-for="bus in primaryBusinessOptions" :key="bus" :label="bus" :value="bus" />
            </el-select>
          </el-form-item>
          <el-form-item label="专业要求：" prop="major">
            <el-select v-model="formData.major" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="2">
              <el-option v-for="maj in primaryMajorTypeOption" :key="maj" :label="maj" :value="maj" />
            </el-select>
          </el-form-item>
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
    width: 260px !important;
    display: flex;
  }

  :deep(.el-textarea) {
    width: 1160px;
  }
}
</style>
