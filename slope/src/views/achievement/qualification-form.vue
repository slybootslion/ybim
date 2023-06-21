<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { back } from '@/views/scientific_research/project-method'
import {
  addAptitude, clearFormData, editAptitude, editId,
  formData, getEditData, handleUploadFile, loading, primaryAptitudeGradeOption, primaryAptitudeTypeOption,
} from '@/views/achievement/qualification-method'
import { getTreeList, level2List } from '@/views/system/personnel-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'

getTreeList()

const route = useRoute()
const query = route.query
if (!query.aptitude_id) clearFormData()
else getEditData(query.aptitude_id as string)

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  aptitude_name: [{ required: true, message: '输入资质名称', trigger: 'blur' }],
  cert_number: [{ required: true, message: '输入证书号码', trigger: 'blur' }],
  issuer: [{ required: true, message: '输入发证机关', trigger: 'blur' }],
  aptitude_type: [{ required: true, message: '选择资质类别', trigger: 'change' }],
  aptitude_grade: [{ required: true, message: '选择资质等级', trigger: 'change' }],
  cert_valid_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  department_id: [{ required: true, message: '选择日期', trigger: 'change' }],
})
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // delete formData.fileList
      if (!editId.value) await addAptitude(formData)
      else {
        formData.aptitude_id = editId.value
        await editAptitude(formData)
      }
      loading.value = false
      back()
    }
  })
}
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          资质登记
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
          <el-form-item label="资质名称：" prop="aptitude_name">
            <el-input v-model="formData.aptitude_name" />
          </el-form-item>
          <el-form-item label="证书号码：" prop="cert_number">
            <el-input v-model="formData.cert_number" />
          </el-form-item>
          <el-form-item label="资质类别：" prop="aptitude_type">
            <el-select v-model="formData.aptitude_type">
              <el-option v-for="acpt in primaryAptitudeTypeOption" :key="acpt" :label="acpt" :value="acpt" />
            </el-select>
          </el-form-item>
          <el-form-item label="资质等级：" prop="aptitude_grade">
            <el-select v-model="formData.aptitude_grade" clearable>
              <el-option v-for="aptg in primaryAptitudeGradeOption" :key="aptg" :label="aptg" :value="aptg" />
            </el-select>
          </el-form-item>
          <el-form-item label="发证机关：" prop="issuer">
            <el-input v-model="formData.issuer" />
          </el-form-item>
          <el-form-item label="证书有效日期：" prop="cert_valid_time">
            <el-date-picker v-model="formData.cert_valid_time" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="所属单位" prop="department_id">
            <el-select v-model="formData.department_id">
              <el-option v-for="item in level2List" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人：" prop="principal">
            <el-input v-model="formData.principal" />
          </el-form-item>
          <el-form-item label="联系电话：" prop="principal_phone">
            <el-input v-model="formData.principal_phone" />
          </el-form-item>
          <el-form-item label="原件保管人：" prop="original_keeper">
            <el-input v-model="formData.original_keeper" />
          </el-form-item>
          <el-form-item label="原件总数：" prop="original_keeper">
            <el-input v-model="formData.original_amount" />
          </el-form-item>
          <el-form-item label="现存原件数：" prop="extant_original_amount">
            <el-input v-model="formData.extant_original_amount" />
          </el-form-item>
          <el-form-item label="资质描述：">
            <el-input v-model="formData.aptitude_description" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="证书扫描件：" prop="fileList">
            <!-- eslint-disable-next-line -->
            <el-upload v-model:file-list="formData.fileList as UploadUserFile[]" action="" accept=".pdf,.jpg,.jpeg,.png"
                       :http-request="handleUploadFile"
                       :before-upload="() => beforeUploadFile(formData.cert_attachment as string)"
                       :on-remove="() => handleRemoveFile(formData, 'attachment')"
            >
              <el-button type="primary">
                上传
              </el-button>
            </el-upload>
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
    width: 300px !important;
    display: flex;
  }

  :deep(.el-textarea) {
    width: 1260px;
  }
}
</style>
