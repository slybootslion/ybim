<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'
import type { projectFormDataI } from '@/views/production/project-method'
import {
  clearFormData, formData, loading,
  primaryIndustryTypeOptions, primaryMajorTypeOption,
} from '@/views/production/project-method'
import { primaryBusinessOptions } from '@/views/operate/customer-method'
import { getTreeList, getUserList, level3List } from '@/views/system/personnel-method'
import api from '@/api'
import { getTask, projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'
import { getProject } from '@/views/operate/bid-method'
import PermissionDeniedComp from '@/views/public-components/permission-denied-comp.vue'

const router = useRouter()
const route = useRoute()
const query = route.query
getTreeList()
const userList = ref([])
const initUserList = async () => userList.value = await getUserList()
initUserList()
const editId = ref('')
const ruleFormRef = ref<FormInstance>()
const subRuleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  industry_type: [{ required: true, message: '输入行业类型', trigger: 'change' }],
  project_type: [{ required: true, message: '输入项目类型', trigger: 'change' }],
  majorArr: [{ required: true, message: '输入专业要求', trigger: 'change' }],
  datePick: [{ required: true, message: '输入日期', trigger: 'change' }],
  main_department_id: [{ required: true, message: '输入主体部门', trigger: 'change' }],
  production_user_id: [{ required: true, message: '输入负责人', trigger: 'change' }],
  deadline: [{ required: true, message: '输入成果提交时间', trigger: 'change' }],
  task_name: [{ required: true, message: '输入任务名称', trigger: 'blur' }],
  task_code: [{ required: true, message: '输入任务编码', trigger: 'blur' }],
  allocation_ratio: [{ required: true, message: '输入任划分产值金额', trigger: 'blur' }],
  pcas: [{ required: true, message: '输入地址', trigger: 'change' }],
})
const subRules = reactive<FormRules>({
  task_name: [{ required: true, message: '输入任务名称', trigger: 'blur' }],
  task_code: [{ required: true, message: '输入任务编码', trigger: 'blur' }],
  main_department_id: [{ required: true, message: '输入主体部门', trigger: 'change' }],
  production_user_id: [{ required: true, message: '输入负责人', trigger: 'change' }],
  allocation_ratio: [{ required: true, message: '输入任划分产值金额', trigger: 'blur' }],
  deadline: [{ required: true, message: '输入成果提交时间', trigger: 'change' }],
})
const computedDay = () => formData.days = `${ dayjs(formData.datePick![1]).diff(formData.datePick![0], 'day') } 天`
const addTask = async (data: projectFormDataI) => api.post('/produce/addTask', data)
const isMore = ref(false)
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      formData.start_time = formData.datePick![0]
      formData.end_time = formData.datePick![1]
      formData.major = formData.majorArr.join(',')
      // formData.project_id = formData.project_id[0]
      // delete formData.datePick
      // delete formData.days
      if (isMore.value === false)
        formData.participating_organization = '[]'
      else {
        let checkCount = 0
        for (let i = 0; i < (subRuleFormRef.value as unknown as FormInstance[]).length; i++) {
          const item = (subRuleFormRef.value as unknown as FormInstance[])[i]
          await item.validate(async (v) => {
            if (v) checkCount++
          })
        }
        if (checkCount === formData.poArr?.length) {
          formData.participating_organization = JSON.stringify(formData.poArr)
        } else return false
      }
      // delete formData.poArr
      loading.value = true
      if (!query.task_id) {
        delete formData.task_id
        const res: any = await addTask(formData)
        if (!res || res.code !== 0) {
          loading.value = false
          return
        }
      } else {
        formData.task_id = query.task_id as string
        const res: any = await addTask(formData)
        if (!res || res.code !== 0) {
          loading.value = false
          return
        }
      }
      loading.value = false
      clearFormData()
      await router.push('/production-management/production-list')
    }
  })
}
const addPo = () => {
  formData.poArr!.push({
    task_name: '',
    task_code: '',
    main_department_id: '',
    allocation_ratio: '',
    production_user_id: '',
    deadline: '',
    task_explain: '',
  })
}
const delOp = (index: number) => {
  formData.poArr!.splice(index, 1)
  if (formData.poArr?.length === 0) isMore.value = false
}
setTimeout(() => ruleFormRef.value!.clearValidate())
remoteMethod('')

const projectSelected = async (id: string) => {
  const res: any = await getProject(id)
  await remoteMethod(res.project_name)
  console.log(res)
  if (res.project_status <= 2 || res.project_status >= 12) {
    ElMessage.error('该项目不可发起任务下单')
    clearFormData()
    return
  }
  formData.project_type = res.project_type
  formData.industry_type = res.industry_type
}
const disSelect = ref(false)
const initTask = async (task_id: string) => {
  const data = await getTask(task_id)
  formData.project_id = data.project_id
  await projectSelected(data.project_id)
  disSelect.value = true
  formData.industry_type = data.industry_type
  formData.project_type = data.project_type
  formData.majorArr = data.major.split(',')
  formData.datePick = [data.start_time, data.end_time]
  formData.task_name = data.task_name
  formData.task_code = data.task_code
  formData.main_department_id = data.main_department_id
  formData.allocation_ratio = data.allocation_ratio
  computedDay()
  formData.production_user_id = data.production_user_id
  formData.deadline = data.deadline
  formData.task_explain = data.task_explain
  isMore.value = !!data.participating_organization.length
  if (isMore) {
    for (let i = 0; i < data.participating_organization.length; i++) {
      const item = data.participating_organization[i]
      formData.poArr!.push(item)
    }
  }
}

if (query.task_id) initTask(query.task_id as string)
else clearFormData()
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
      <Auth :value="['PM00201001']">
        <div class="block">
          <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="180px">
            <el-form-item label="关联项目：" prop="project_id">
              <el-select
                v-model="formData.project_id" :disabled="disSelect"
                filterable remote reserve-keyword placeholder="输入项目名称查找" :remote-method="remoteMethod"
                :loading="projectSearchLoading" @change="projectSelected"
              >
                <el-option
                  v-for="p in projectOptions" :key="p.project_id" :label="p.project_name"
                  :value="p.project_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="行业类型：" prop="industry_type">
              <el-select v-model="formData.industry_type" disabled>
                <el-option v-for="ind in primaryIndustryTypeOptions" :key="ind" :label="ind" :value="ind" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目类型：" prop="project_type">
              <el-select v-model="formData.project_type" disabled>
                <el-option v-for="bus in primaryBusinessOptions" :key="bus" :label="bus" :value="bus" />
              </el-select>
            </el-form-item>
            <el-form-item label="专业要求：" prop="majorArr">
              <el-select
                v-model="formData.majorArr" multiple collapse-tags collapse-tags-tooltip
                :max-collapse-tags="2"
              >
                <el-option v-for="maj in primaryMajorTypeOption" :key="maj" :label="maj" :value="maj" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目起止时间：" prop="datePick">
              <el-date-picker
                v-model="formData.datePick" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="computedDay"
              />
            </el-form-item>
            <el-form-item label="项目工期：">
              <el-input v-model="formData.days" disabled />
            </el-form-item>
            <el-form-item label="任务名称：" prop="task_name">
              <el-input v-model="formData.task_name" />
            </el-form-item>
            <el-form-item label="任务编码：" prop="task_code">
              <el-input v-model="formData.task_code" />
            </el-form-item>
            <el-form-item label="主体生产机构：" prop="main_department_id">
              <el-select v-model="formData.main_department_id">
                <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="划分产值金额（比例）：" prop="allocation_ratio">
              <el-input v-model="formData.allocation_ratio" />
            </el-form-item>
            <el-form-item label="生产负责人：" prop="production_user_id">
              <el-select v-model="formData.production_user_id">
                <el-option v-for="item in userList" :key="item.user_id" :label="item.user_name" :value="item.user_id" />
              </el-select>
            </el-form-item>
            <el-form-item label="成果提交时间：" prop="deadline">
              <el-date-picker v-model="formData.deadline" value-format="YYYY-MM-DD" type="date" />
            </el-form-item>
            <el-form-item label="其他说明：">
              <el-input
                v-model="formData.task_explain" maxlength="800" type="textarea" :rows="5"
                placeholder="请输入800字以内的说明"
              />
            </el-form-item>
            <div>
              <el-form-item label="有无参与机构：">
                <el-switch v-model="isMore" />
              </el-form-item>
            </div>
          </el-form>
          <div v-if="isMore" class="more-box">
            <div v-for="(poForm, index) in formData.poArr" :key="index" class="po-item">
              <el-form
                ref="subRuleFormRef" inline :model="formData.poArr![index]" :rules="subRules as FormRules"
                label-width="180px"
              >
                <el-icon class="op-icon" @click="delOp(index)">
                  <svg-icon name="ep:circle-close" />
                </el-icon>
                <el-form-item label="任务名称：" prop="task_name">
                  <el-input v-model="poForm.task_name" />
                </el-form-item>
                <el-form-item label="任务编码：" prop="task_code">
                  <el-input v-model="poForm.task_code" />
                </el-form-item>
                <el-form-item label="主体生产机构：" prop="main_department_id">
                  <el-select v-model="poForm.main_department_id">
                    <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="划分产值金额（比例）：" prop="allocation_ratio">
                  <el-input v-model="poForm.allocation_ratio" />
                </el-form-item>
                <el-form-item label="生产负责人：" prop="production_user_id">
                  <el-select v-model="poForm.production_user_id">
                    <el-option
                      v-for="item in userList" :key="item.user_id" :label="item.user_name"
                      :value="item.user_id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="成果提交时间：" prop="deadline">
                  <el-date-picker v-model="poForm.deadline" value-format="YYYY-MM-DD" type="date" />
                </el-form-item>
                <el-form-item label="其他说明：">
                  <el-input
                    v-model="poForm.task_explain"
                    class="sub-textarea" maxlength="800" type="textarea" :rows="5"
                    placeholder="请输入800字以内的说明"
                  />
                </el-form-item>
              </el-form>
            </div>
            <el-button @click="addPo">
              +新增参与机构
            </el-button>
          </div>
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
    width: 260px !important;
    display: flex;
  }

  :deep(.el-textarea) {
    width: 1060px;
  }

  .more-box {
    //margin-left: 120px;
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

  .sub-textarea {
    width: 880px;
  }
}
</style>
