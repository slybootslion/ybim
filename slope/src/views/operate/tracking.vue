<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import { formData, loading } from '@/views/operate/tracking-method'
import { getTreeList } from '@/views/system/personnel-method'
getTreeList()
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      console.log('---')
    }
  })
}
const rules = reactive<FormRules>({
  project_id: [{ required: true, message: '输入项目名称', trigger: 'blur' }],
  business_trip_users: [{ required: true, message: '输入人员', trigger: 'blur' }],
  datePick: [{ required: true, message: '选择跟踪时间', trigger: 'change' }],
})
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
      <div class="block">
        <el-form ref="ruleFormRef" inline :model="formData" :rules="rules as FormRules" label-width="180px">
          <div>
            <el-form-item label="项目名称：" prop="project_id">
              <el-input v-model="formData.project_id" />
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
