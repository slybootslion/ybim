<script setup lang="ts">
import api from '@/api'
import { activeFileData, getTask } from '@/views/production/task-method'
import TaskFileTable from '@/views/production/components/task-file-table.vue'
import { getProject } from '@/views/operate/bid-method'

const props = defineProps<{
  taskId: string
}>()
const loading = ref(false)
const projectStatus = ref(-1)
const getFileList = async () => {
  loading.value = true
  const res = await api.get(`/produce/getMaterialFileList?task_id=${ props.taskId }`)
  const taskRes = await getTask(props.taskId)
  const resProject = await getProject(taskRes.project_id)
  projectStatus.value = resProject.project_status
  activeFileData.value = res.data
  loading.value = false
}
getFileList()
const uploadSuccess = () => getFileList()
</script>

<template>
  <el-tabs tab-position="left">
    <el-tab-pane label="成果文档">
      <TaskFileTable :file-list="activeFileData.achievement || []" :project-status="projectStatus" :task-id="taskId" :produce-file-type="0" @upload-success="uploadSuccess" />
    </el-tab-pane>
    <el-tab-pane label="外业资料">
      <TaskFileTable :file-list="activeFileData.field || []" :project-status="projectStatus" :task-id="taskId" :produce-file-type="1" @upload-success="uploadSuccess" />
    </el-tab-pane>
    <el-tab-pane label="图纸">
      <TaskFileTable :file-list="activeFileData.drawing || []" :project-status="projectStatus" :task-id="taskId" :produce-file-type="2" @upload-success="uploadSuccess" />
    </el-tab-pane>
    <el-tab-pane label="批复">
      <TaskFileTable :file-list="activeFileData.reply || []" :project-status="projectStatus" :task-id="taskId" :produce-file-type="3" @upload-success="uploadSuccess" />
    </el-tab-pane>
    <el-tab-pane label="变更">
      <TaskFileTable :file-list="activeFileData.variation || []" :project-status="projectStatus" :task-id="taskId" :produce-file-type="4" @upload-success="uploadSuccess" />
    </el-tab-pane>
    <el-tab-pane label="影像资料">
      <TaskFileTable :file-list="activeFileData.video || []" :project-status="projectStatus" :task-id="taskId" :produce-file-type="5" @upload-success="uploadSuccess" />
    </el-tab-pane>
    <el-tab-pane label="其他">
      <TaskFileTable :file-list="activeFileData.other || []" :project-status="projectStatus" :task-id="taskId" :produce-file-type="6" @upload-success="uploadSuccess" />
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss">
//
</style>
