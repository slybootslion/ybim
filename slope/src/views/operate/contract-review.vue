<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { formData } from '@/views/operate/contract-review-methods'
import { projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'
const ruleFormRef = ref<FormInstance>()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      console.log('submit')
    }
  })
}
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  operation_department_id: [{ required: true, message: '选择单位', trigger: 'change' }],
})
remoteMethod('')
</script>

<template>
  <div>
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
      <div class="block">
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="180px">
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
    width: 1160px;
  }
}
</style>
