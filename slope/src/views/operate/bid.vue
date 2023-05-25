<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { remoteMethod } from '@/views/production/task-method'
import { formData } from '@/views/operate/bid-method'
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  fileList: [{ required: true, message: '上传附件', trigger: 'change' }],
})
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      console.log(valid)
    }
  })
}
remoteMethod('')
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="top">
        <div>
          项目投标申请
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
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="140px">
          <div class="block-title">
            基本信息
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
