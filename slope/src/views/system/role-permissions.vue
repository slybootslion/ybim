<script setup lang="ts">
import { FormInstance } from 'element-plus'
import {
  UserListData,
  activeName, activeRoleId, activeRoleName, addNew, changeActive, dialogForm, dialogShow, editRoleHandle, getRole,
  handleClick,
  ruleFormRef,
  rules, submitForm, tabLoading, tableItem,
} from '@/views/system/role-method'
import { pageLoading } from '@/utils/tools'
import { RoleItem, roleData } from '@/views/system/personnel-method'
import RoleMember from '@/views/system/components/role-member.vue'

const loading = pageLoading()

getRole().then(() => {
  changeActive({ role_id: activeRoleId.value, role_name: activeRoleName.value, role_memo: activeRoleName.value })
  loading.close()
})
</script>

<template>
  <div>
    <page-main class="page-main">
      <div class="left">
        <div class="left-top">
          <div class="title">
            系统角色
          </div>
          <el-button size="large" type="primary" style="width: 100%;" @click="addNew">
            添加角色
          </el-button>
        </div>
        <div class="left-bottom">
          <div
            v-for="item in roleData" :key="item.role_id" class="left-bottom-item"
            :class="activeRoleId === item.role_id && 'active'"
          >
            <div class="item-left" @click="changeActive(item)">
              {{ (item as RoleItem).role_name }}
            </div>
            <div class="item-right">
              <el-icon class="right-icon" @click="editRoleHandle(item)">
                <svg-icon name="ep:edit" />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-top">
          {{ activeRoleName }}
        </div>
        <div v-loading="tabLoading" class="right-bottom">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="角色成员" name="角色成员">
              <RoleMember :table-data="UserListData as tableItem[]" />
            </el-tab-pane>
            <el-tab-pane label="功能权限" name="功能权限">
              功能权限
            </el-tab-pane>
            <el-tab-pane label="数据权限" name="数据权限">
              数据权限
            </el-tab-pane>
          </el-tabs>
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
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="dialogForm.role_name" placeholder="角色名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef as FormInstance)">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </page-main>
  </div>
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
      .left-bottom-item {
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        padding: 0 10px;
        &.active {
          color: #fff;
          background-color: #409EFF;
        }
        .item-left {
          cursor: pointer;
        }
        .right-icon {
          cursor: pointer;
        }
      }
    }
  }
  .right {
    flex: 1;
    overflow: auto;
    margin-left: 10px;
    .right-top {
      font-size: 16px;
    }
  }
}
</style>
