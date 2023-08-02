<script setup lang="ts">
import {
  activeTailList, downloadItem,
  getTailList,
  tailItemI,
} from '@/views/operate/project-method'
import { checkAuth, checkIsOwn, delItemHandle } from '@/utils/tools'
import api from '@/api'

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

const del = async (tail_id: string) => {
  await api.post('/project/delTail', { tail_id })
  await getDetail()
}
const delItem = (id: string) => delItemHandle('', del, id)
const router = useRouter()
const editItem = (id: string) => router.push(`/tracking-information/tracking?project_id=${props.projectId}&tail_id=${id}`)
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <div class="top-button">
        <el-button
          v-auth="['PM00101011']" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/tracking-information/tracking' })"
        >
          跟踪记录
        </el-button>
        <el-button
          v-auth="['PM00101004']" type="primary"
          @click="() => emit('goRouter', { projectId: props.projectId, url: '/project-bidding/bidding' })"
        >
          新建投标评审
        </el-button>
      </div>
      <el-collapse v-if="activeTailList.length" v-model="activeNames">
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
            <el-descriptions-item label="联系方式：">
              {{ (item as tailItemI).visiting_clients_man_phone }}
            </el-descriptions-item>
            <el-descriptions-item label="沟通主题：">
              {{ (item as tailItemI).subject }}
            </el-descriptions-item>
            <el-descriptions-item label="采购方式：">
              {{ (item as tailItemI).purchase_way }}
            </el-descriptions-item>
            <el-descriptions-item label="业务类别：">
              {{ (item as tailItemI).service_class }}
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
            <el-descriptions-item v-if="(item as tailItemI).attachment_url" label="附件：">
              <el-button link type="primary" @click="downloadItem((item as tailItemI).attachment_url as string)">
                {{ (item as tailItemI).attachment_name }}.
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
          <div style="display: flex; justify-content: flex-end">
            <el-button v-if="checkAuth('PM00101016') && checkIsOwn((item as tailItemI).tail_user)" @click="editItem((item as tailItemI).tail_id)">
              编辑
            </el-button>
            <el-button v-if="checkAuth('PM00101017') && checkIsOwn((item as tailItemI).tail_user)" @click="delItem((item as tailItemI).tail_id)">
              删除
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-empty v-else />
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
