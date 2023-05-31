<script setup lang="ts">
import { activeTailList, getTailList, tailItemI } from '@/views/operate/project-method'

const props = defineProps<{
  projectId: string
}>()
const emit = defineEmits(['goRouter'])
const loading = ref(false)
const getDetail = async () => {
  loading.value = true
  activeTailList.value = await getTailList(props.projectId)
  loading.value = false
}
getDetail()
const activeNames = ref(0)
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <div class="top-button">
        <el-button type="primary" @click="() => emit('goRouter', { projectId: props.projectId, url: '/tracking-information/tracking' })">
          跟踪记录
        </el-button>
        <el-button type="primary" @click="() => emit('goRouter', {})">
          新建投标评审
        </el-button>
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in activeTailList"
          :key="index"
          :name="index"
          :title="`跟踪人员/时间：${(item as tailItemI).tail_user} ${(item as tailItemI).tail_start_time} -- ${(item as tailItemI).tail_end_time}`"
        >
          <el-descriptions :column="1">
            <el-descriptions-item label="拜访客户：">
              {{ (item as tailItemI).visiting_clients_company }}
            </el-descriptions-item>
            <el-descriptions-item label="拜访人员：">
              {{ (item as tailItemI).visiting_clients_man }}
            </el-descriptions-item>
            <el-descriptions-item label="沟通主题：">
              {{ (item as tailItemI).subject }}
            </el-descriptions-item>
            <el-descriptions-item label="实施或招标方式：">
              {{ (item as tailItemI).purchase_way }}
            </el-descriptions-item>
            <el-descriptions-item label="商务关系情况说明：">
              {{ (item as tailItemI).business_relations }}
            </el-descriptions-item>
            <el-descriptions-item label="对接内容：">
              {{ (item as tailItemI).docking_content }}
            </el-descriptions-item>
            <el-descriptions-item label="后续跟进及工作计划：">
              {{ (item as tailItemI).follow_up_plan }}
            </el-descriptions-item>
            <el-descriptions-item label="其他事项说明：">
              {{ (item as tailItemI).others }}
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "tab-comp-style";
.block {
  :deep(.el-collapse-item__header) {
    font-size: 18px;
    font-weight: 700;
  }
}
</style>
