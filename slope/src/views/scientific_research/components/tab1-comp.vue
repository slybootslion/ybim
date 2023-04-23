<script setup lang="ts">
import type { projectDataI } from '@/views/scientific_research/project-method'

defineProps<{
  detailData: projectDataI
}>()
</script>

<template>
  <div class="block">
    <el-descriptions title="基本信息" :column="2">
      <el-descriptions-item label="科研项目名称：">
        {{ detailData.research_name }}
      </el-descriptions-item>
      <el-descriptions-item label="项目编码：">
        {{ detailData.research_code }}
      </el-descriptions-item>
      <el-descriptions-item label="科研项目类别：">
        {{ detailData.research_type }}
      </el-descriptions-item>
      <el-descriptions-item label="立项年度：">
        {{ detailData.initiation_year }}
      </el-descriptions-item>
      <el-descriptions-item label="项目起始时间：">
        {{ detailData.start_time }}
      </el-descriptions-item>
      <el-descriptions-item label="项目截止时间：">
        {{ detailData.end_time }}
      </el-descriptions-item>
      <el-descriptions-item label="项目属地：">
        {{ detailData.project_dependency_province }} {{ detailData.project_dependency_city }}
      </el-descriptions-item>
      <el-descriptions-item label="业主：">
        {{ detailData.proprietor_customer }}
      </el-descriptions-item>
      <el-descriptions-item label="主体承担部门：">
        {{ detailData.competent_department }}
      </el-descriptions-item>
      <el-descriptions-item label="参与单位：">
        {{ detailData.participating_department }}
      </el-descriptions-item>
      <el-descriptions-item label="项目负责人：">
        {{ detailData.project_leader_user }}
      </el-descriptions-item>
      <el-descriptions-item label="登记人：">
        {{ detailData.registrant_user }}
      </el-descriptions-item>
      <el-descriptions-item label="参与人员：">
        {{ detailData.participants_user }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <div v-if="detailData.research_type === '科研课题'" class="block block-text">
    <el-descriptions title="其他信息" :column="1">
      <el-descriptions-item label="项目概况：">
        {{ detailData.project_general }}
      </el-descriptions-item>
      <el-descriptions-item label="项目研究目的：">
        {{ detailData.research_purpose }}
      </el-descriptions-item>
      <el-descriptions-item label="项目研究内容：">
        {{ detailData.research_contents }}
      </el-descriptions-item>
      <el-descriptions-item label="项目考核指标：">
        {{ detailData.performance }}
      </el-descriptions-item>
      <el-descriptions-item label="备注：">
        {{ detailData.remarks }}
      </el-descriptions-item>
      <el-descriptions-item label="附件：">
        <a :href="`http://management.ayphp.com/${detailData.attachment_url}`" target="_blank">
          {{ detailData.attachment_name }}
        </a>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped lang="scss">
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
</style>
