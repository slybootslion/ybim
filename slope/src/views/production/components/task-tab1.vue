<script setup lang="ts">
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { activeTaskData, getTask, resTaskDataI } from '@/views/production/task-method'
import type { approveFormDataI } from '@/views/operate/project-method'
import { approveLoading, approveSubmit, rules } from '@/views/operate/project-method'
import api from '@/api'
import { checkAuth, checkIsOwn, findLastAppItem } from '@/utils/tools'
import { back } from '@/views/scientific_research/project-method'
import ApproveList from '@/views/operate/components/approve-list.vue'

const props = defineProps<{
  taskId: string
}>()
const loading = ref(false)
const days = ref('')
const ruleFormRef = ref<FormInstance>()
const formData: approveFormDataI = reactive<approveFormDataI>({
  approve_contents: '',
  approve_id: '',
})
const getDetail = async () => {
  const data = await getTask(props.taskId)
  activeTaskData.value = data as resTaskDataI
  if (data && data.approve_id) formData.approve_id = data.approve_id
  if (data && data.end_time && data.start_time) days.value = `${ dayjs(data.end_time).diff(data.start_time, 'day') }`
}
getDetail()

const router = useRouter()
const endProject = async () => {
  await api.post('/project/endProject', { project_id: activeTaskData.value.project_id })
  router.back()
}

const toEdit = () => router.push(`/task-order/task?task_id=${ props.taskId }`)

const cancel = () => {
  ElMessageBox.confirm(
    '点击确定后将无法恢复该任务单，是否继续？',
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(async () => {
    const res: any = await api.post('/produce/cancelTask', { task_id: props.taskId })
    if (res && res.code === 0) {
      ElMessage({
        type: 'success',
        message: '任务单已取消',
      })
      back()
    }
  }).catch(console.log)
}

const checkCancel = () => {
  const isOwn = checkIsOwn(activeTaskData.value.registrant_user)
  const last = findLastAppItem(activeTaskData.value.task_approve)
  const isAuth = checkAuth('PM00201007')
  return isOwn && isAuth && last && (last.approve_result === '等待审核' || last.approve_result === '驳回')
}

const checkEdit = () => {
  const isOwn = checkIsOwn(activeTaskData.value.registrant_user)
  const last = findLastAppItem(activeTaskData.value.task_approve)
  const isAuth = checkAuth('PM00201001')
  return isOwn && isAuth && last && (last.approve_result === '等待审核' || last.approve_result === '驳回')
}

defineExpose({
  endProject,
})
</script>

<template>
  <div v-loading="loading">
    <div class="btn-edit-box">
      <el-button v-if="checkCancel()" type="primary" @click="cancel">
        取消
      </el-button>
      <el-button v-if="checkEdit()" type="primary" @click="toEdit">
        编辑
      </el-button>
    </div>
    <div class="block">
      <el-descriptions title="" :column="2">
        <el-descriptions-item label="科研项目名称：">
          {{ activeTaskData.project_name }}
        </el-descriptions-item>
        <el-descriptions-item label="项目编码：">
          {{ activeTaskData.project_id }}
        </el-descriptions-item>
        <el-descriptions-item label="行业类型：">
          {{ activeTaskData.industry_type }}
        </el-descriptions-item>
        <el-descriptions-item label="项目类型：">
          {{ activeTaskData.project_type }}
        </el-descriptions-item>
        <el-descriptions-item label="专业要求：">
          {{ activeTaskData.major }}
        </el-descriptions-item>
        <el-descriptions-item label="项目起止时间：">
          {{ activeTaskData.start_time }} —— {{ activeTaskData.end_time }}
        </el-descriptions-item>
        <el-descriptions-item label="项目工期：">
          {{ days }}天
        </el-descriptions-item>
        <el-descriptions-item label="经办人：">
          {{ activeTaskData.registrant_user }}天
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="2" style="margin-top: 40px;">
        <el-descriptions-item label="任务名称：">
          {{ activeTaskData.task_name }}
        </el-descriptions-item>
        <el-descriptions-item label="任务编码：">
          {{ activeTaskData.task_code }}
        </el-descriptions-item>
        <el-descriptions-item label="主体生产机构：">
          {{ activeTaskData.main_department }}
        </el-descriptions-item>
        <el-descriptions-item label="划分产值金额比例：">
          {{ activeTaskData.allocation_ratio }}
        </el-descriptions-item>
        <el-descriptions-item label="生产负责人：">
          {{ activeTaskData.production_user }}
        </el-descriptions-item>
        <el-descriptions-item label="成果提交时间：">
          {{ activeTaskData.deadline }}
        </el-descriptions-item>
        <el-descriptions-item label="生产任务情况说明：">
          {{ activeTaskData.task_explain }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
        v-for="op in activeTaskData.participating_organization" :key="op.taskCode" :column="2"
        style="margin-top: 40px;"
      >
        <el-descriptions-item label="任务名称：">
          {{ op.task_name }}
        </el-descriptions-item>
        <el-descriptions-item label="任务编码：">
          {{ op.taskCode }}
        </el-descriptions-item>
        <el-descriptions-item label="参与机构：">
          {{ op.department }}
        </el-descriptions-item>
        <el-descriptions-item label="划分产值金额比例：">
          {{ op.allocation_ratio }}
        </el-descriptions-item>
        <el-descriptions-item label="生产负责人：">
          {{ op.production_user }}
        </el-descriptions-item>
        <el-descriptions-item label="成果提交时间：">
          {{ op.deadline }}
        </el-descriptions-item>
        <el-descriptions-item label="生产任务情况说明：">
          {{ op.task_explain }}
        </el-descriptions-item>
      </el-descriptions>
      <el-form
        v-if="(activeTaskData as resTaskDataI).approve_id"
        ref="ruleFormRef"
        v-auth="['PM00201005']" inline :model="formData"
        :rules="rules as FormRules" label-width="130px"
        style="margin-bottom: 20px;"
      >
        <el-descriptions v-loading="approveLoading" title="审核信息" :column="1">
          <el-descriptions-item label="审核：">
            <el-form-item label="" prop="approve_result">
              <el-radio-group v-model="formData.approve_result">
                <el-radio :label="1">
                  通过
                </el-radio>
                <el-radio :label="-1">
                  不通过
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="审核意见：">
            <el-form-item label="" prop="approve_contents">
              <el-input v-model="formData.approve_contents" type="textarea" rows="1" />
            </el-form-item>
          </el-descriptions-item>
          <el-descriptions-item label="">
            <el-button type="primary" @click="approveSubmit(ruleFormRef as FormInstance, formData, getDetail)">
              提交
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
      </el-form>
      <ApproveList v-if="activeTaskData.task_approve.length" :conre-approve="activeTaskData.task_approve" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../operate/components/tab-comp-style";
.block {
  margin-top: 10px;
  :deep(.el-descriptions__body) {
    padding: 0 20px;
    white-space: pre-wrap;
  }
}
.block-text {
  :deep(.el-descriptions__cell) {
    display: flex;
    .el-descriptions__label {
      width: 100px;
    }
    .el-descriptions__content {
      flex: 1;
    }
  }
}
.btn-edit-box {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
