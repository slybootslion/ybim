<script setup lang="ts">
import { FormInstance } from 'element-plus'
import type { TreeNode } from '@/views/system/personnel-method'
import {
  addDepartment, addUserHandle, departmentList, drawerForm, drawerRules, drawerShow, editDepartment, editTableItem,
  getRoleList, getTableData, getTreeList, level3List, logoutTableItem, roleData, ruleFormRef, rules, searchName,
  submitUser, tableData, tableLoading, tableSelect, treeData,
} from '@/views/system/personnel-method'
import { pageLoading } from '@/utils/tools'

const loading = pageLoading()

getTreeList().then(() => loading.close())
getTableData().then(() => tableLoading.value = false)
const getRole = async () => roleData.value = await getRoleList()
getRole()

const dialogShow = ref(false)
const dialogForm: Record<string, string> = reactive({
  name: '',
  department: '',
})
const editId = ref('')
const edit = (data: TreeNode) => {
  dialogForm.name = data.department_name
  dialogForm.department = data.department_parent_id
  editId.value = data.department_id
  dialogShow.value = true
}
// const remove = (node: Node, data: TreeNode) => {
//   console.log(node)
//   console.log(data)
//   // const parent = (node as any).parent
//   // const children: Tree[] = parent.data.children || parent.data
//   // const index = children.findIndex(d => d.id === data.id)
//   // children.splice(index, 1)
//   // treeData.value = [...treeData.value]
// }

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

const searchDepartment = ref('')
const searchKeyword = ref('')
const handleSelectionChange = (val: any[]) => {
  console.log(val)
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
        <div class="right-top-search">
          <div style="margin-right: 10px;">
            <el-input v-model="searchKeyword" placeholder="搜索姓名" clearable @change="searchName" />
          </div>
          <div>
            <el-select v-model="searchDepartment" clearable placeholder="选择部门" @change="tableSelect">
              <el-option
                v-for="item in level3List"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="right-top-btn">
          <el-button size="large" type="primary" @click="addUserHandle">
            添加人员
          </el-button>
        </div>
      </div>
      <div class="right-bottom">
        <el-table
          v-loading="tableLoading"
          border
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column property="user_name" label="姓名" width="110" />
          <el-table-column property="user_sex" label="性别" />
          <el-table-column property="user_age" label="年龄" />
          <el-table-column property="user_empno" label="工号" width="140" />
          <el-table-column property="user_organization_name" label="所属机构" width="230" />
          <el-table-column property="user_department_name" label="部门" width="140" />
          <el-table-column property="user_phone" label="手机号码" width="140" />
          <el-table-column property="user_email" label="企业邮箱" width="170" />
          <el-table-column property="user_work_age" label="司龄" />
          <el-table-column property="entry_time" label="入职时间" width="110" />
          <el-table-column label="当前状态" width="90">
            <template #default="scope">
              <el-tag
                :type="scope.row.in_service_label === '离职' ? '' : 'success'"
                disable-transitions
              >
                {{ scope.row.in_service_label }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click.prevent="editTableItem(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click.prevent="logoutTableItem(scope.row)"
              >
                注销
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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
          <el-select v-model="dialogForm.department" style="width:100%" clearable placeholder="上级部门">
            <el-option
              v-for="item in departmentList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef as FormInstance)">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-drawer
      ref="drawerRef"
      v-model="drawerShow"
      title="添加人员"
      direction="ltr"
      size="50%"
    >
      <div class="demo-drawer__content">
        <el-form ref="ruleFormRef" :model="drawerForm" :rules="drawerRules" label-width="120px">
          <el-form-item label="人员姓名" prop="user_name">
            <el-input v-model="drawerForm.user_name" autocomplete="off" placeholder="输入姓名" style="width: 320px" />
          </el-form-item>
          <el-form-item label="性别" prop="user_sex">
            <el-select v-model="drawerForm.user_sex" placeholder="输入性别">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="user_brithday">
            <el-date-picker v-model="drawerForm.user_brithday" value-format="YYYY-MM-DD" type="date"
                            placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="工号" prop="user_empno">
            <el-input v-model="drawerForm.user_empno" placeholder="输入工号" autocomplete="off" style="width: 320px" />
          </el-form-item>
          <el-form-item label="所属部门" prop="user_department_id">
            <el-select v-model="drawerForm.user_department_id" placeholder="选择部门">
              <el-option v-for="item in level3List" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="人员角色" prop="user_role_id">
            <el-select v-model="drawerForm.user_role_id" placeholder="选择角色">
              <el-option v-for="item in roleData" :key="item.role_id" :label="item.role_name" :value="item.role_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码" prop="user_phone">
            <el-input v-model="drawerForm.user_phone" placeholder="输入手机号" style="width: 320px" />
          </el-form-item>
          <el-form-item label="企业邮箱" prop="user_email">
            <el-input v-model="drawerForm.user_email" placeholder="输入邮箱" style="width: 320px" />
          </el-form-item>
          <el-form-item label="入职时间" prop="entry_time">
            <el-date-picker v-model="drawerForm.entry_time" value-format="YYYY-MM-DD" type="date"
                            placeholder="选择日期" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUser(ruleFormRef as FormInstance)">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </page-main>
</template>

<style scoped lang="scss">
.page-main {
  display: flex;
  .left {
    width: 290px;
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
    overflow: auto;
    margin-left: 10px;
    .right-top {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .right-top-search {
        display: flex;
      }
    }
    .right-bottom {
      flex: 1;
    }
  }
}
</style>
