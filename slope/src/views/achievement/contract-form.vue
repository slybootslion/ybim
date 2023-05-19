<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import {
  firstFocus,
  firstPartyKeyOption,
  firstPartyOption, formData, loading, paymentTypeChange, remoteFirstPartyMethod, remoteSecondPartyMethod, secondFocus,
  secondPartyKeyOption,
  secondPartyOption,
} from '@/views/achievement/contract-method'
import { back } from '@/views/scientific_research/project-method'
import { projectOptions, projectSearchLoading, remoteMethod } from '@/views/production/task-method'

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  payment_type: [{ required: true, message: '选择收支类型', trigger: 'change' }],
  project_id: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  first_party: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  second_party: [{ required: true, message: '输入项目名称', trigger: 'change' }],
  contract_name: [{ required: true, message: '输入合同名称', trigger: 'blur' }],
  contract_number: [{ required: true, message: '输入合同编号', trigger: 'blur' }],
})
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      console.log(formData)
    }
  })
}

setTimeout(() => ruleFormRef.value!.clearValidate())
</script>

<template>
  <div v-loading="loading">
    <page-main class="page-main">
      <div class="top">
        <div>
          合同登记存档
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
          <div>
            <el-form-item label="收支类型：" prop="payment_type">
              <el-select v-model="formData.payment_type" clearable @change="paymentTypeChange">
                <el-option label="收入" value="收入" />
                <el-option label="支出" value="支出" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="关联项目：" prop="project_id">
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
          <el-form-item label="合同名称：" prop="contract_name">
            <el-input v-model="formData.contract_name" />
          </el-form-item>
          <el-form-item label="合同编号：" prop="contract_number">
            <el-input v-model="formData.contract_number" />
          </el-form-item>
          <div>
            <el-form-item label="甲方：" prop="first_party">
              <el-select
                v-model="formData.first_party" filterable remote reserve-keyword placeholder="输入名称查找"
                :remote-method="remoteFirstPartyMethod" :loading="projectSearchLoading" @focus="firstFocus"
              >
                <el-option
                  v-for="p in firstPartyOption" :key="p[firstPartyKeyOption]"
                  :label="p[firstPartyKeyOption]" :value="p[firstPartyKeyOption]"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="乙方：" prop="second_party">
              <el-select
                v-model="formData.second_party" filterable remote reserve-keyword placeholder="输入名称查找"
                :remote-method="remoteSecondPartyMethod"
                :loading="projectSearchLoading" @focus="secondFocus"
              >
                <el-option
                  v-for="p in secondPartyOption" :key="p[secondPartyKeyOption]"
                  :label="p[secondPartyKeyOption]" :value="p[secondPartyKeyOption]"
                />
              </el-select>
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
