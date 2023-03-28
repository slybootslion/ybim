<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { addDepartment, editDepartment, getDepartmentList } from '@/views/system/system-api'
import { pageLoading } from '@/utils/tools'

const loading = pageLoading()

interface TreeNode {
  children?: TreeNode[]
  department_id: string
  department_parent_id: string
  department_name: string
  value?: string
  label?: string
}

const treeData = ref<TreeNode[]>()
const departmentList = ref<TreeNode[]>([])
const level2List = ref<TreeNode[]>([])
const level3List = ref<TreeNode[]>([])
const getTreeList = async () => {
  const res = await getDepartmentList()
  treeData.value = res.data
  const flatTree = (node: TreeNode, level: number) => {
    if (level === 3) {
      level3List.value.push(node)
      return
    }
    if (level === 2) level2List.value.push(node)
    node.value = node.department_id
    node.label = node.department_name
    departmentList.value?.push(node)
    if (node.children?.length) {
      for (const child of node.children) {
        flatTree(child, level + 1)
      }
    }
  }
  flatTree(res.data[0], 1)
  loading.close()
}
getTreeList()
const dialogShow = ref(false)
const dialogForm = reactive({
  name: '',
  department: '',
})
const editId = ref('')
const edit = (data: TreeNode) => {
  console.log(data)
  dialogForm.name = data.department_name
  dialogForm.department = data.department_parent_id
  editId.value = data.department_id
  dialogShow.value = true
}
const remove = (node: Node, data: TreeNode) => {
  console.log(node)
  console.log(data)
  // const parent = (node as any).parent
  // const children: Tree[] = parent.data.children || parent.data
  // const index = children.findIndex(d => d.id === data.id)
  // children.splice(index, 1)
  // treeData.value = [...treeData.value]
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [{ required: true, message: '输入部门名称', trigger: 'blur' }],
  department: [{ required: true, message: '选择部门', trigger: 'change' }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // edit
  if (editId.value !== '') {
    await formEl.validate(async (valid) => {
      if (valid) {
        const res: any = await editDepartment(dialogForm.department, dialogForm.name, editId.value)
        if (res.code === 0) dialogShow.value = false
      }
    })
  } else {
    await formEl.validate(async (valid) => {
      if (valid) {
        const res: any = await addDepartment(dialogForm.department, dialogForm.name)
        if (res.code === 0) dialogShow.value = false
      }
    })
  }
  await getTreeList()
}
const addNew = () => {
  dialogForm.name = ''
  dialogForm.department = ''
  dialogShow.value = true
  editId.value = ''
}
</script>

<template>
  <page-main class="page-main">
    <div class="left">
      <div class="left-top">
        <div class="title">
          组织架构
        </div>
        <el-button size="large" type="primary" style="width: 100%;" @click="addNew">
          添加部门
        </el-button>
      </div>
      <div class="left-bottom">
        <el-tree
          :data="treeData"
          node-key="department_id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <span>{{ data.department_name }}</span>
              <span>
                <el-icon v-if="data.department_parent_id !== 'DPTOP'" @click="edit(data)">
                  <svg-icon name="ep:edit" />
                </el-icon>
                <!--                <el-icon -->
                <!--                  v-if="data.department_parent_id !== 'DPTOP'" style="margin-left: 8px" -->
                <!--                  @click="remove(node, data)" -->
                <!--                > -->
                <!--                  <svg-icon name="ep:delete" /> -->
                <!--                </el-icon> -->
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="right">
      <div class="right-top">
        <div>
          <div>search</div>
          <div>select</div>
        </div>
        <div class="right-top-btn">
          <el-button size="large" type="primary">添加人员</el-button>
        </div>
      </div>
      <div class="right-bottom">
        table
      </div>
    </div>
    <el-dialog
      v-model="dialogShow"
      title="添加部门"
      width="30%"
      destroy-on-close
      draggable
    >
      <el-form
        ref="ruleFormRef"
        :model="dialogForm"
        :rules="rules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="dialogForm.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="上级部门" prop="department">
          <el-select-v2
            v-model="dialogForm.department"
            style="width:100%"
            placeholder="上级部门"
            clearable
            :options="departmentList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </page-main>
</template>

<style scoped lang="scss">
.page-main {
  display: flex;
  .left {
    width: 330px;
    .left-top {
      padding: 10px;
      border-bottom: 1px solid var(--el-border-color);
      .title {
        font-size: 18px;
        margin-bottom: 10px;
      }
    }
    .left-bottom {
      padding: 10px;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
  }
  .right {
    flex: 1;
    .right-top {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
