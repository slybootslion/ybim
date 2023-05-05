<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { back } from '@/views/scientific_research/project-method'
import {
  beforeUploadFile, formData, handleRemoveFile, handleUploadFile, loading, submit,
} from '@/views/record-method'

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  filing_type: [{ required: true, message: '输入备案类型', trigger: 'change' }],
  filing_url: [{ required: true, message: '输入备案网址', trigger: 'blur' }],
  filing_url_login_account: [{ required: true, message: '输入登录账号', trigger: 'blur' }],
  filing_url_login_password: [{ required: true, message: '输入登录密码', trigger: 'blur' }],
  pcas: [{ required: true, message: '输入地址', trigger: 'change' }],
  filing_platform: [{ required: true, message: '输入平台/部门', trigger: 'blur' }],
  responsible_person: [{ required: true, message: '经办人', trigger: 'blur' }],
  filing_time: [{ required: true, message: '备案时间', trigger: 'change' }],
  filing_valid_time: [{ required: true, message: '备案有效日期', trigger: 'change' }],
  trick_lock: [{ required: true, message: '是否有密码锁', trigger: 'change' }],
  filing_cert: [{ required: true, message: '是否有密码锁', trigger: 'change' }],
  fileList: [{ required: true, message: '上传扫描件', trigger: 'change' }],
  trick_lock_custodian: [{ required: true, message: '输入详细地址', trigger: 'blur' }],
  trick_lock_principal_phone: [{ required: true, message: '输入联系人', trigger: 'blur' }],
  other: [{ required: true, message: '输入联系人', trigger: 'blur' }],
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
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="170px">
          <el-form-item label="备案类型：" prop="filing_type">
            <el-select v-model="formData.filing_type">
              <el-option label="本地备案" value="本地备案" />
              <el-option label="网络备案" value="网络备案" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.filing_type === '网络备案'" label="备案网址：" prop="filing_url">
            <el-input v-model="formData.filing_url" />
          </el-form-item>
          <el-form-item v-if="formData.filing_type === '网络备案'" label="登录账号：" prop="filing_url_login_account">
            <el-input v-model="formData.filing_url_login_account" />
          </el-form-item>
          <el-form-item v-if="formData.filing_type === '网络备案'" label="登录密码：" prop="filing_url_login_password">
            <el-input v-model="formData.filing_url_login_password" />
          </el-form-item>
          <el-form-item label="备案省份：" prop="pcas" class="w600">
            <pcas-cascader v-model="formData.pcas" type="pc" format="name" />
          </el-form-item>
          <el-form-item label="备案单位：" prop="filing_department">
            <el-input v-model="formData.filing_department" />
          </el-form-item>
          <el-form-item label="备案平台名称/部门：" prop="filing_platform">
            <el-input v-model="formData.filing_platform" />
          </el-form-item>
          <el-form-item label="经办人：" prop="responsible_person">
            <el-input v-model="formData.responsible_person" />
          </el-form-item>
          <el-form-item label="备案时间：" prop="filing_time">
            <el-date-picker v-model="formData.filing_time" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="备案有效日期：" prop="filing_valid_time">
            <el-date-picker v-model="formData.filing_valid_time" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="有效状态：" prop="valid_status">
            <el-select v-model="formData.valid_status">
              <el-option label="有效" :value="1" />
              <el-option label="无效" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否密码锁：" prop="trick_lock">
            <el-select v-model="formData.trick_lock">
              <el-option label="有" :value="1" />
              <el-option label="无" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.trick_lock === 1" label="密码锁保管人员：" prop="trick_lock_custodian">
            <el-input v-model="formData.trick_lock_custodian" />
          </el-form-item>
          <el-form-item v-if="formData.trick_lock === 1" label="密码锁负责人电话：" prop="trick_lock_principal_phone">
            <el-input v-model="formData.trick_lock_principal_phone" />
          </el-form-item>
          <el-form-item label="有无备案证书：" prop="filing_cert">
            <el-select v-model="formData.filing_cert">
              <el-option label="有" :value="1" />
              <el-option label="无" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formData.filing_cert === 1" label="备案证书扫描件上传：" prop="fileList">
            <!-- eslint-disable-next-line -->
            <el-upload v-model:file-list="formData.fileList as UploadUserFile[]" action="" accept=".jpg,.jpeg,.png"
                       :http-request="handleUploadFile" :before-upload="beforeUploadFile" :on-remove="handleRemoveFile"
            >
              <el-button type="primary">
                上传
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="其他说明：" prop="other">
            <el-input
              v-model="formData.other" maxlength="800" type="textarea" :rows="8"
              placeholder="请输入800字以内的说明"
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
    width: 260px !important;
    display: flex;
  }

  :deep(.el-textarea) {
    width: 1160px;
  }
}
</style>
