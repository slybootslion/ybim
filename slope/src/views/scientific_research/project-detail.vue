<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { activeProjectData, back, getProject, projectDataI } from '@/views/scientific_research/project-method'
import Tab1Comp from '@/views/scientific_research/components/tab1-comp.vue'

const loading = ref(false)

const route = useRoute()
const router = useRouter()
const getDetail = async () => {
  const { research_id } = route.query
  if (!research_id) {
    ElMessage.warning('项目id不正确')
    router.push('/scientific-research/project')
    return
  }
  loading.value = true
  const data = await getProject(research_id)
  activeProjectData.value = data as unknown as projectDataI
  loading.value = false
}
getDetail()
const activeName = ref('基本信息')
</script>

<template>
  <page-main v-loading="loading" class="page-main">
    <div class="top">
      <div>
        科研项目登记
      </div>
      <div>
        <el-button type="primary">
          编辑
        </el-button>
        <el-button type="primary">
          完结
        </el-button>
        <el-button @click="back">
          返回
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="基本信息">
          <Tab1Comp :detail-data="activeProjectData as unknown as projectDataI" />
        </el-tab-pane>
        <el-tab-pane label="科研任务资料" name="科研任务资料">
          科研任务资料
        </el-tab-pane>
      </el-tabs>
    </div>
  </page-main>
</template>

<style scoped lang="scss">
.page-main {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
