<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { back } from '@/views/scientific_research/project-method'
import {
  addIpr, clearFormData, editId, editIpr, formData, getEditData, handleUploadFile1,
  handleUploadFile2, loading, primaryResultTypeOptions,
} from '@/views/achievement/knowledge-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'

const route = useRoute()
const query = route.query
if (!query.ip_id) clearFormData()
else getEditData(query.ip_id as string)
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  result_type: [{ required: true, message: '选择类型', trigger: 'change' }],
  application_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  authorize_time: [{ required: true, message: '选择日期', trigger: 'change' }],
  result_name: [{ required: true, message: '输入成果名称', trigger: 'blur' }],
  property_owner: [{ required: true, message: '输入权属人', trigger: 'blur' }],
  copyright_owner: [{ required: true, message: '输入著作人', trigger: 'blur' }],
})
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // delete formData.fileList2
      // delete formData.fileList1
      console.log(formData)
      // delete formData.application_year_str
      if (!editId.value) {
        delete formData.ip_id
        const res: any = await addIpr(formData)
        if (!res || res.code !== 0) {
          loading.value = false
          return
        }
      } else {
        formData.ip_id = editId.value
        const res: any = await editIpr(formData)
        if (!res || res.code !== 0) {
          loading.value = false
          return
        }
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
          知识产权信息登记
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
          <el-form-item label="成果类型：" prop="result_type">
            <el-select v-model="formData.result_type">
              <el-option v-for="rt in primaryResultTypeOptions" :key="rt" :label="rt" :value="rt" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请号/授权号/专利号：" prop="request_code">
            <el-input v-model="formData.request_code" />
          </el-form-item>
          <el-form-item label="成果名称：" prop="result_name">
            <el-input v-model="formData.result_name" />
          </el-form-item>
          <el-form-item label="权属人（专利权人）：" prop="property_owner">
            <el-input v-model="formData.property_owner" />
          </el-form-item>
          <el-form-item label="著作人：" prop="copyright_owner">
            <el-input v-model="formData.copyright_owner" />
          </el-form-item>
          <el-form-item label="代理机构：">
            <el-input v-model="formData.agent" />
          </el-form-item>
          <!--          <el-form-item label="申请年度："> -->
          <!--            <el-date-picker v-model="formData.application_year_str" value-format="YYYY" type="year" /> -->
          <!--          </el-form-item> -->
          <el-form-item label="申请时间：" prop="application_time">
            <el-date-picker v-model="formData.application_time" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="授权/受理时间：" prop="authorize_time">
            <el-date-picker v-model="formData.authorize_time" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="有效期：" prop="validity">
            <el-date-picker v-model="formData.validity" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-form-item label="申请部门：">
            <!--            <el-select v-model="formData.application_department"> -->
            <!--              <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" /> -->
            <!--            </el-select> -->
            <el-input v-model="formData.application_department" />
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="formData.linkman" />
          </el-form-item>
          <el-form-item label="缴纳年费：">
            <el-select v-model="formData.yearly_payment_status">
              <el-option label="已缴纳" value="已缴纳" />
              <el-option label="未缴纳" value="未缴纳" />
            </el-select>
          </el-form-item>
          <el-form-item label="年费（元）：">
            <el-input v-model="formData.yearly_payment" />
          </el-form-item>
          <!--          <el-form-item label="年费时间："> -->
          <!--            <el-date-picker v-model="formData.yearly_payment_time" value-format="YYYY-MM-DD" type="date" /> -->
          <!--          </el-form-item> -->
          <div>
            <el-form-item label="成果证书：" prop="fileList">
              <!-- eslint-disable-next-line -->
              <el-upload v-model:file-list="formData.fileList2 as UploadUserFile[]" action=""
                         accept=".pdf,.jpg,.png,jpeg"
                         :http-request="handleUploadFile2"
                         :before-upload="() => beforeUploadFile(formData.result_cert_attachment)"
                         :on-remove="() => handleRemoveFile(formData, 'result_cert_attachment')"
              >
                <el-button type="primary">
                  上传
                </el-button>
              </el-upload>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="附件其他：" prop="fileList">
              <!-- eslint-disable-next-line -->
              <el-upload v-model:file-list="formData.fileList1 as UploadUserFile[]" action=""
                         accept=".pdf,.jpg,.png,jpeg"
                         :http-request="handleUploadFile1"
                         :before-upload="() => beforeUploadFile(formData.other_attachment)"
                         :on-remove="() => handleRemoveFile(formData, 'other_attachment')"
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
    width: 1260px;
  }
}
</style>
