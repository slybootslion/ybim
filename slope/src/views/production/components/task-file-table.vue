<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus/lib/components'
import type { taskFileI } from '@/views/production/task-method'
import { getDownloadUrl } from '@/views/scientific_research/project-method'
import api, { baseURL } from '@/api'

const props = defineProps<{
  fileList: taskFileI[]
  taskId: string
  produceFileType: number
}>()
const emit = defineEmits(['uploadSuccess'])
const loading = ref(false)
const downloadItem = async (url: string) => {
  loading.value = true
  const res = await getDownloadUrl(url.slice(4))
  window.open(baseURL + res.down_url.slice(3))
  loading.value = false
}
const uploadMaterialFile = async (file: File, task_id: string, produce_file_type: number) => {
  loading.value = true
  const res: any = await api.post('/produce/uploadMaterialFile', { file, task_id, produce_file_type })
  if (res.code === 0) emit('uploadSuccess')
  loading.value = false
}
const upload = async (obj: UploadRequestOptions) => uploadMaterialFile(obj.file, props.taskId, props.produceFileType)
</script>

<template>
  <el-upload :http-request="upload" :show-file-list="false" style="margin-bottom: 20px;">
    <el-button type="primary">
      上传资料
    </el-button>
  </el-upload>
  <el-table v-loading="loading" :data="fileList" border style="width: 100%">
    <el-table-column prop="research_file_name" label="文件">
      <template #default="scope">
        <el-button link type="primary" @click="downloadItem(scope.row.file_url)">
          {{ scope.row.produce_file_name }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column prop="upload_user" label="上传人" width="200" />
    <el-table-column prop="create_time" label="上传时间" width="260" />
    <el-table-column label="操作" width="160">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="downloadItem(scope.row.file_url)">
          下载
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
//
</style>
