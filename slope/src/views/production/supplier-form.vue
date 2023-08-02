<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { back } from '@/views/scientific_research/project-method'
import {
  clearFormData,
  formData, getEditData, handleUploadFile, loading, primarySupplierTypeOption, submit,
} from '@/views/production/supplier-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'
import PermissionDeniedComp from "@/views/public-components/permission-denied-comp.vue";
const route = useRoute()
const query = route.query
if (query.supplier_id) getEditData(query.supplier_id as string)
else clearFormData()
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  supplier_name: [{ required: true, message: '输入名称', trigger: 'blur' }],
  supplier_type: [{ required: true, message: '输入类型', trigger: 'change' }],
  primary_business: [{ required: true, message: '输入主营业务/产品', trigger: 'blur' }],
  address_detail: [{ required: true, message: '输入详细地址', trigger: 'blur' }],
  pcas: [{ required: true, message: '输入地址', trigger: 'change' }],
  linkman: [{ required: true, message: '输入联系人', trigger: 'blur' }],
  linkman_phone: [
    { required: true, message: '输入电话', trigger: 'blur' },
    { min: 11, max: 11, message: '输入正确手机号', trigger: ['blur', 'change'] },
  ],
  linkman_post: [{ required: true, message: '输入职务', trigger: 'blur' }],
  supplier_general: [{ required: true, message: '输入概况', trigger: 'blur' }],
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
          <el-button v-auth="['PM00202001']" type="primary" @click="submit(ruleFormRef as FormInstance)">
            提交
          </el-button>
          <el-button @click="back">
            返回
          </el-button>
        </div>
      </div>
    </page-main>
    <page-main class="page-main">
      <Auth :value="['PM00202001']">
        <div class="block">
          <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px">
            <el-form-item label="供应商名称：" prop="supplier_name">
              <el-input v-model="formData.supplier_name" />
            </el-form-item>
            <el-form-item label="供应商分类：" prop="supplier_type">
              <el-select v-model="formData.supplier_type" clearable>
                <el-option v-for="sup in primarySupplierTypeOption" :key="sup" :label="sup" :value="sup" />
              </el-select>
            </el-form-item>
            <el-form-item label="主营业务/产品：" prop="primary_business">
              <el-input
                v-model="formData.primary_business" maxlength="200" type="textarea" :rows="3"
                placeholder=""
              />
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
            <el-form-item label="企业资质：">
              <el-input v-model="formData.enterprise_qualification" />
            </el-form-item>
            <div>
              <el-form-item label="附件上传：" prop="fileList">
                <!-- eslint-disable-next-line -->
                <el-upload v-model:file-list="formData.fileList as UploadUserFile[]" action="" accept=".jpg,.jpeg,.png"
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
            <el-form-item label="供应商概况：" prop="supplier_general">
              <el-input
                v-model="formData.supplier_general" maxlength="800" type="textarea" :rows="3"
                placeholder=""
              />
            </el-form-item>
          </el-form>
        </div>
        <template #no-auth>
          <PermissionDeniedComp />
        </template>
      </Auth>
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
    width: 1260px;
  }
}
</style>
