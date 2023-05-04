<script lang="ts" setup>
import ProjectResearchTable from '@/views/operate/components/project-research-table.vue'
import { getPersonData, personList } from '@/views/scientific_research/project-method'

const dialogFormVisible = ref(false)
const form = reactive({ user_id: '' })
getPersonData()
const handoverProject = () => {
  console.log(form.user_id)
  dialogFormVisible.value = false
}
const openDialog = () => {
  form.user_id = ''
  dialogFormVisible.value = true
}

const addNew = () => console.log('addNew')
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
        <el-button size="large" @click="openDialog">
          项目转让/移交
        </el-button>
        <el-button size="large" type="primary" @click="addNew">
          项目备案立项
        </el-button>
      </div>
    </div>
    <div class="bottom">
      <ProjectResearchTable />
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
