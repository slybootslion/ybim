<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { projectId } from '@/views/operate/project-method'
import { back } from '@/views/scientific_research/project-method'
import ProjectTab1 from '@/views/operate/components/project-tab1.vue'
import ProjectTab4 from '@/views/operate/components/project-tab4.vue'
import ProjectTab3 from '@/views/operate/components/project-tab3.vue'
import ProjectTab2 from '@/views/operate/components/project-tab2.vue'
import PermissionDeniedComp from '@/views/public-components/permission-denied-comp.vue'

const activeName = ref('基本信息')
const route = useRoute()
const query = route.query
if (!query.project_id) {
  ElMessage.error('项目id错误')
  back()
} else {
  projectId.value = query.project_id as string
  activeName.value = query.type === '1' ? '投标信息' : query.type === '2' ? '合同评审' : query.type === '4' ? '跟踪信息' : '基本信息'
}
const router = useRouter()

interface goRouterParams {
  url: string
  projectId: string
  r: boolean
}

const goRouter = ({ url, ...o }: goRouterParams) => {
  let u = `${url}?`
  for (const oKey in o) {
    if (oKey === 'projectId') {
      u += `project_id=${o.projectId}`
    }
    if (oKey === 'r') {
      u += `&r=${o.r}`
    }
  }
  router.push(u)
}
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
    <Auth :value="['PM00101002']">
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
      <template #no-auth>
        <PermissionDeniedComp />
      </template>
    </Auth>
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
