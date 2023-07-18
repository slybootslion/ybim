<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import ProjectResearchTable from '@/views/operate/components/project-research-table.vue'
import { getPersonData, modifyOperation, personList } from '@/views/scientific_research/project-method'
import { getList, pageData } from '@/views/operate/project-method'
const dialogFormVisible = ref(false)
const form = reactive({ user_id: '' })
getPersonData()
const projectIds = ref('')
const getSelectedProjectId = (project_ids: string) => projectIds.value = project_ids
const handoverProject = async () => {
  const res: any = await modifyOperation({ operation_user_id: form.user_id, project_ids: projectIds.value })
  if (res && res.code === 0) {
    form.user_id = ''
    await getList(pageData)
    dialogFormVisible.value = false
  }
}
const openDialog = () => {
  // form.user_id = ''
  if (projectIds.value === '') {
    ElMessage.error('未选择项目')
    return
  }
  console.log(form.user_id)
  dialogFormVisible.value = true
}
const router = useRouter()
const addNew = () => router.push('/project-approval/approval')
</script>

<template>
  <page-main class="page-main">
    <div class="top">
      <div class="top-left">
        <div class="title">
          立项项目管理
        </div>
      </div>
      <div class="top-right">
        <el-button size="large" style="margin-right: 10px;" @click="openDialog">
          项目转让/移交
        </el-button>
        <el-button v-auth="['PM00101001']" size="large" type="primary" @click="addNew">
          项目备案立项
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <ProjectResearchTable @get-selected-project-id="getSelectedProjectId" />
    </div>
    <el-dialog v-model="dialogFormVisible" title="确认转让" destroy-on-close>
      <el-form :model="form as Record<string, any>">
        <el-form-item label="接收人：" :label-width="120">
          <el-select v-model="form.user_id" placeholder="选择人员">
            <el-option v-for="p in personList" :key="p.user_id" :label="p.user_name" :value="p.user_id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handoverProject">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </page-main>
</template>

<style lang="scss" scoped>
.page-main {
  .top {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-left {
      font-size: 18px;
    }
  }
}
</style>
