<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { projectId } from '@/views/operate/project-method'
import { back } from '@/views/scientific_research/project-method'
import ProjectTab1 from '@/views/operate/components/project-tab1.vue'
import ProjectTab4 from '@/views/operate/components/project-tab4.vue'
import ProjectTab3 from '@/views/operate/components/project-tab3.vue'
import ProjectTab2 from '@/views/operate/components/project-tab2.vue'

const route = useRoute()
const query = route.query
if (!query.project_id) {
  ElMessage.error('项目id错误')
  back()
} else projectId.value = query.project_id as string
const activeName = ref('基本信息')
const router = useRouter()
interface goRouterParams {
  url: string
  projectId: string
}
const goRouter = ({ url, projectId }: goRouterParams) => router.push(`${url}?project_id=${projectId}`)
</script>

<template>
  <page-main class="page-main">
    <div class="top">
      <div>
        立项项目信息
      </div>
      <div>
        <el-button @click="back">
          返回
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="基本信息">
          <ProjectTab1 :project-id="projectId as string" @go-router="goRouter" />
        </el-tab-pane>
        <el-tab-pane label="跟踪信息" name="跟踪信息">
          <ProjectTab2 :project-id="projectId as string" @go-router="goRouter" />
        </el-tab-pane>
        <el-tab-pane label="投标信息" name="投标信息">
          <ProjectTab3 :project-id="projectId as string" @go-router="goRouter" />
        </el-tab-pane>
        <el-tab-pane label="合同评审" name="合同评审">
          <ProjectTab4 :project-id="projectId as string" @go-router="goRouter" />
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
