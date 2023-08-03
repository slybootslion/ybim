<script setup lang="ts">
import type { approveItemI } from '@/views/operate/project-method'

defineProps<{
  conreApprove: approveItemI[]
}>()
</script>

<template>
  <el-descriptions style="margin-top: 20px;" title="审批意见" :column="1">
    <el-descriptions-item
      v-for="(item, index) in conreApprove"
      :key="index"
    >
      <div style="display: flex;">
        <div style="width: 140px;">
          {{ item.approve_time }}
        </div> {{ item.approve_user }}
        <el-tag :type="item.approve_result.includes('通过') ? '' : item.approve_result.includes('驳') ? 'danger' : 'info'" effect="dark">
          {{ item.approve_result }}
        </el-tag>
      </div>
      <div
        :style="index === conreApprove.length - 1 ? {} : { minHeight: '80px', borderLeft: '1px solid #ccc' }"
        style="margin: 5px 0 5px 120px; padding: 0 26px; position:relative;"
      >
        {{ item.approve_contents }}
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>
