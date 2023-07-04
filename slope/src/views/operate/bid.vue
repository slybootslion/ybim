<script setup lang="ts">
import { ElMessage, FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'
import {
  clearFormData, formData, getProject, getTender, handleUploadFile1, handleUploadFile2, handleUploadFile3, loading,
  projectHandle, registerTenderResult, selectBlur, selectChange,
} from '@/views/operate/bid-method'
import { getTreeList, level2List } from '@/views/system/personnel-method'
import { beforeUploadFile, handleRemoveFile } from '@/utils/tools'
import { back } from '@/views/scientific_research/project-method'

getTreeList()
remoteMethod('')
const route = useRoute()
const query = route.query
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  win_bidder: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  fileList: [{ required: true, message: '上传附件', trigger: 'change' }],
  tender_result: [{ required: true, message: '选择结果', trigger: 'change' }],
  tender_money: [{ required: true, message: '输入金额', trigger: 'blur' }],
})
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // delete formData.fileList1
      // delete formData.fileList2
      // delete formData.fileList3
      delete formData.project_id
      if (formData.tender_result !== '中标') {
        delete formData.win_time
        delete formData.win_bidder
      }
      const res: any = await registerTenderResult(formData)
      if (res.code !== 0) {
        loading.value = false
        return
      }
      clearFormData()
      setTimeout(() => ruleFormRef.value!.clearValidate(), 300)
      if (query.project_id) back()
      loading.value = false
    }
  })
}
const initProject = async (id: string) => {
  const res = await getProject(id)
  const tenderRes = await getTender(id)
  if (!tenderRes.tender_id) {
    ElMessage.error('投标id不存在')
    back()
    return
  }
  formData.tender_id = tenderRes.tender_id
  formData.project_id = query.project_id as string
  formData.project_general = res.project_general
}
if (query.project_id) initProject(query.project_id as string)
else clearFormData()
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div>
          登记投标结果
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
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="146px">
          <div class="block-title">
            项目信息
          </div>
          <div>
            <el-form-item label="项目名称：" prop="project_id">
              <el-select
                v-model="formData.project_id" filterable remote reserve-keyword placeholder="输入项目名称查找"
                :remote-method="remoteMethod" :loading="projectSearchLoading"
                @change="projectHandle"
              >
                <el-option
                  v-for="p in projectOptions" :key="p.project_id" :label="p.project_name"
                  :value="p.project_id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="项目概况：">
            <el-input
              v-model="formData.project_general" maxlength="800" type="textarea" :rows="6"
              placeholder="请输入不少于100字，不多于800字以内的项目概况信息，如（项目总规模及我司承接工作内容、规模、等级等）"
            />
          </el-form-item>
          <div>
            <el-form-item label="投标结果：" prop="tender_result">
              <el-radio-group v-model="formData.tender_result" class="ml-4">
                <el-radio label="中标">
                  中标
                </el-radio>
                <el-radio label="放弃">
                  放弃
                </el-radio>
                <el-radio label="落标">
                  落标
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="block-title">
            投标结果信息
          </div>
          <div v-if="formData.tender_result === '中标' || formData.tender_result === ''">
            <el-form-item label="中标单位：" prop="win_bidder">
              <el-select
                v-model="formData.win_bidder" filterable remote reserve-keyword :loading="projectSearchLoading"
                @blur="selectBlur" @change="selectChange"
              >
                <el-option v-for="item in level2List" :key="item.label" :label="item.label" :value="item.label" />
              </el-select>
            </el-form-item>
            <el-form-item label="中标日期：" prop="win_time">
              <el-date-picker v-model="formData.win_time" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
            <el-form-item label="中标金额（万元）：" prop="tender_money">
              <el-input-number v-model="formData.tender_money" controls-position="right" />
            </el-form-item>
            <div>
              <el-form-item label="投标报价清单：">
                <!-- eslint-disable-next-line -->
                <el-upload v-model:file-list="formData.fileList1 as UploadUserFile[]" action=""
                           accept=".pdf,.jpg,.png,jpeg"
                           :http-request="handleUploadFile1"
                           :before-upload="() => beforeUploadFile(formData.tender_offer)"
                           :on-remove="() => handleRemoveFile(formData, 'tender_offer')"
                >
                  <el-button type="primary">
                    上传
                  </el-button>
                </el-upload>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="中标通知书：">
                <!-- eslint-disable-next-line -->
                <el-upload v-model:file-list="formData.fileList2 as UploadUserFile[]" action=""
                           accept=".pdf,.jpg,.png,jpeg"
                           :http-request="handleUploadFile2"
                           :before-upload="() => beforeUploadFile(formData.win_tender_inform)"
                           :on-remove="() => handleRemoveFile(formData, 'win_tender_inform')"
                >
                  <el-button type="primary">
                    上传
                  </el-button>
                </el-upload>
              </el-form-item>
            </div>
          </div>
          <div
            v-if="formData.tender_result === '落标' || formData.tender_result === '放弃' || formData.tender_result === ''"
          >
            <el-form-item label="放弃原因/落标原因：">
              <el-input
                v-model="formData.lost_tender_note" maxlength="800" type="textarea" :rows="6"
                placeholder=""
              />
            </el-form-item>
          </div>
          <div class="block-title">
            标书信息上传
          </div>
          <div>
            <el-form-item label="标书文件：">
              <!-- eslint-disable-next-line -->
              <el-upload v-model:file-list="formData.fileList3 as UploadUserFile[]" action=""
                         accept=".pdf,.jpg,.png,jpeg"
                         :http-request="handleUploadFile3"
                         :before-upload="() => beforeUploadFile(formData.tender_documents)"
                         :on-remove="() => handleRemoveFile(formData, 'tender_documents')"
              >
                <el-button type="primary">
                  上传
                </el-button>
              </el-upload>
            </el-form-item>
          </div>
          <el-form-item label="备注：">
            <el-input
              v-model="formData.tender_documents_note" maxlength="800" type="textarea" :rows="6"
              placeholder=""
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

  .block-title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 20px;
  }

  :deep(.el-input),
  :deep(.el-cascader),
  :deep(.el-switch),
  :deep(.el-input-number),
  :deep(.el-select) {
    width: 220px !important;
  }

  :deep(.el-textarea) {
    width: 860px;
  }
}
</style>
