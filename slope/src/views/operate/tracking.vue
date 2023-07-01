<script setup lang="ts">
import { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { addTail, clearFormData, formData, handleUploadFile, loading } from '@/views/operate/tracking-method'
import { getTreeList } from '@/views/system/personnel-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'
import { projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'

getTreeList()
remoteMethod('')
const route = useRoute()
const query = route.query
const ruleFormRef = ref<FormInstance>()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      formData.tail_start_time = formData.datePick![0]
      formData.tail_end_time = formData.datePick![1]
      // delete formData.datePick
      // delete formData.fileList
      loading.value = true
      const res: any = await addTail(formData)
      if (res!.code !== 0) {
        loading.value = false
        return
      }
      clearFormData()
      loading.value = false
    }
  })
}
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'blur' }],
  business_trip_users: [{ required: true, message: '输入人员', trigger: 'blur' }],
  visiting_clients_company: [{ required: true, message: '输入客户', trigger: 'blur' }],
  visiting_clients_man: [{ required: true, message: '输入人员', trigger: 'blur' }],
  docking_content: [{ required: true, message: '输入人员', trigger: 'blur' }],
  subject: [{ required: true, message: '输入主题', trigger: 'blur' }],
  datePick: [{ required: true, message: '选择跟踪时间', trigger: 'change' }],
})
if (query.project_id) {
  formData.project_id = query.project_id as string
} else clearFormData()
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          跟踪信息记录
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
          <div>
            <el-form-item label="项目名称：" prop="project_id">
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
            <el-form-item label="项目起止时间：" prop="datePick">
              <el-date-picker
                v-model="formData.datePick" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
          <el-form-item label="跟踪/出差人员：" prop="business_trip_users">
            <el-input v-model="formData.business_trip_users" />
          </el-form-item>
          <el-form-item label="拜访客户：" prop="visiting_clients_company">
            <el-input v-model="formData.visiting_clients_company" />
          </el-form-item>
          <el-form-item label="拜访人员：" prop="visiting_clients_man">
            <el-input v-model="formData.visiting_clients_man" />
          </el-form-item>
          <el-form-item label="联系方式：">
            <el-input v-model="formData.visiting_clients_man_phone" />
          </el-form-item>
          <el-form-item label="沟通主题：" prop="subject">
            <el-input v-model="formData.subject" />
          </el-form-item>
          <el-form-item label="采购方式：">
            <el-input v-model="formData.purchase_way" />
          </el-form-item>
          <el-form-item label="业务类别：">
            <el-input v-model="formData.service_class" />
          </el-form-item>
          <el-form-item label="商务关系情况说明：">
            <el-input v-model="formData.business_relations" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="对接内容：" prop="docking_content">
            <el-input v-model="formData.docking_content" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="后续跟进及工作计划：">
            <el-input v-model="formData.follow_up_plan" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
          <el-form-item label="其他事项说明：">
            <el-input v-model="formData.others" maxlength="800" type="textarea" :rows="5" />
          </el-form-item>
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
    width: 960px;
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
