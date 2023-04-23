<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import {
  back, beforeUploadFile, fileList, formData, getPersonData, handlePreviewFile, handleRemoveFile, handleUploadFile,
  loading, personList,
  submit,
} from '@/views/scientific_research/project-method'
import { getTreeList, level3List } from '@/views/system/personnel-method'
import { customerList, getCustomerList } from '@/views/operate/customer-method'

const ruleFormRef = ref<FormInstance>()
getCustomerList()
getTreeList()
getPersonData()
const rules = reactive<FormRules>({
  research_name: [{ required: true, message: '输入项目名称', trigger: 'blur' }],
  research_code: [{ required: true, message: '输入项目编码', trigger: 'blur' }],
  research_type: [{ required: true, message: '输入项目类别', trigger: 'change' }],
  initiation_year: [{ required: true, message: '输入立项年度', trigger: 'change' }],
  start_time: [{ required: true, message: '输入起始时间', trigger: 'change' }],
  end_time: [{ required: true, message: '输入截止时间', trigger: 'change' }],
  pcas: [{ required: true, message: '输入项目属地', trigger: 'change' }],
  proprietor_customer_id: [{ required: true, message: '输入业主', trigger: 'change' }],
  competent_department: [{ required: true, message: '输入主体部门', trigger: 'change' }],
  project_leader_user: [{ required: true, message: '输入项目负责人', trigger: 'change' }],
})
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          科研项目登记
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
        <div class="block-title">
          基本信息
        </div>
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="130px">
          <el-form-item label="科研项目名称：" prop="research_name">
            <el-input v-model="formData.research_name" />
          </el-form-item>
          <el-form-item label="项目编码：" prop="research_code">
            <el-input v-model="formData.research_code" />
          </el-form-item>
          <el-form-item label="科研项目类别：" prop="research_type">
            <el-select v-model="formData.research_type">
              <el-option label="科研课题" value="科研课题" />
              <el-option label="标准项目" value="标准项目" />
            </el-select>
          </el-form-item>
          <el-form-item label="立项年度：" prop="initiation_year_string">
            <el-date-picker v-model="formData.initiation_year_string" value-format="YYYY" type="year" />
          </el-form-item>
          <el-form-item label="项目起始时间：" prop="start_time">
            <el-date-picker v-model="formData.start_time" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="项目截止时间：" prop="end_time">
            <el-date-picker v-model="formData.end_time" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="项目属地：" prop="pcas">
            <pcas-cascader v-model="formData.pcas" type="pc" format="name" />
          </el-form-item>
          <el-form-item label="业主：" prop="proprietor_customer_id">
            <el-select v-model="formData.proprietor_customer_id">
              <el-option
                v-for="item in customerList" :key="item.customer_id" :label="item.customer_name"
                :value="item.customer_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主体承担部门：" prop="competent_department_id">
            <el-select v-model="formData.competent_department_id" clearable>
              <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="参与单位：">
            <el-select v-model="formData.participating_department_id" clearable>
              <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="项目负责人：" prop="project_leader_user_id">
            <el-select v-model="formData.project_leader_user_id" clearable>
              <el-option v-for="item in personList" :key="item.user_id" :label="item.user_name" :value="item.user_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="参与人员：">
            <el-select v-model="formData.participants_user_list" collapse-tags multiple clearable>
              <el-option v-for="item in personList" :key="item.user_id" :label="item.user_name" :value="item.user_id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="formData.research_type === '科研课题'" class="block">
        <div class="block-title">
          其他信息
        </div>
        <el-form :model="formData" label-width="130px">
          <el-form-item label="项目概况：">
            <el-input
              v-model="formData.project_general" maxlength="800" type="textarea" :rows="4"
              placeholder="请输入800字以内的项目概况信息，如（项目概况等）"
            />
          </el-form-item>
          <el-form-item label="项目研究目的：">
            <el-input
              v-model="formData.research_purpose" maxlength="800" type="textarea" :rows="4"
              placeholder="请输入800字以内的项目概况信息，如（项目研究目的等）"
            />
          </el-form-item>
          <el-form-item label="主要研究内容：">
            <el-input
              v-model="formData.research_contents" maxlength="800" type="textarea" :rows="4"
              placeholder="请输入800字以内的信息，如（项目的主要研究内容等）"
            />
          </el-form-item>
          <el-form-item label="项目考核指标：">
            <el-input
              v-model="formData.performance" maxlength="800" type="textarea" :rows="4"
              placeholder="请输入800字以内的信息，如（项目需提供xx方案一套、xxx资料等等）"
            />
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              v-model="formData.remarks" maxlength="800" type="textarea" :rows="4"
              placeholder="请输入800字以内的项目概况信息，如（项目总规模及我司承接工作内容、规模、等级等）"
            />
          </el-form-item>
          <el-form-item label="附件：">
            <!-- eslint-disable-next-line -->
            <el-upload v-model:file-list="fileList as UploadUserFile[]" action="" accept=".pdf"
                       :http-request="handleUploadFile" :before-upload="beforeUploadFile"
                       :on-preview="handlePreviewFile" :on-remove="handleRemoveFile"
            >
              <el-button type="primary">
                上传
              </el-button>
              <template #tip>
                <div class="el-upload__tip">
                  上传pdf文件
                </div>
              </template>
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

  .block-title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 20px;
  }

  :deep(.el-form-item__content),
  :deep(.el-cascader),
  :deep(.el-select) {
    width: 220px !important;
  }

  :deep(.el-textarea) {
    width: 860px;
  }
}
</style>
