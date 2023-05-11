<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { back } from '@/views/scientific_research/project-method'
import {
  cleanFormData, formData, getEditData, loading, primaryBusinessOptions, submit
} from '@/views/operate/customer-method'

const route = useRoute()
const query = route.query
if (query.customer_id) getEditData(query.customer_id as string)
else cleanFormData()
const ruleFormRef = ref<FormInstance>()
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
          客户登记
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
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px">
          <el-form-item label="客户名称：" prop="customer_name">
            <el-input v-model="formData.customer_name" />
          </el-form-item>
          <el-form-item label="部门：">
            <el-input v-model="formData.customer_department" />
          </el-form-item>
          <el-form-item label="科研项目类别：" prop="primary_business_list">
            <el-select v-model="formData.primary_business_list" multiple>
              <el-option v-for="bus in primaryBusinessOptions" :key="bus" :label="bus" :value="bus" />
            </el-select>
          </el-form-item>
          <el-form-item label="地址：" prop="pcas" class="w600">
            <pcas-cascader v-model="formData.pcas" type="pc" format="name" />
          </el-form-item>
          <el-form-item label="详细地址：" prop="address_detail">
            <el-input v-model="formData.address_detail" />
          </el-form-item>
          <el-form-item label="联系人：" prop="linkman">
            <el-input v-model="formData.linkman" />
          </el-form-item>
          <el-form-item label="联系人电话：" prop="linkman_phone">
            <el-input v-model="formData.linkman_phone" />
          </el-form-item>
          <el-form-item label="联系人职务：" prop="linkman_post">
            <el-input v-model="formData.linkman_post" />
          </el-form-item>
          <el-form-item label="客户概况：" prop="customer_general">
            <el-input
              v-model="formData.customer_general" maxlength="800" type="textarea" :rows="8"
              placeholder="请输入800字以内的项目概况信息"
            />
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
    width: 320px !important;
    display: flex;
  }

  :deep(.el-textarea) {
    width: 860px;
  }
}
</style>
