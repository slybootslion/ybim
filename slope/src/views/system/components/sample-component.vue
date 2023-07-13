<script setup lang="ts">
import type { sampleItemI } from '@/views/system/role-method'
import { setRolePowerData } from '@/views/system/role-method'
import {tableHeaderCellStyle} from "@/utils/tools";

const props = defineProps<{
  tableData: sampleItemI[]
  roleId: string
}>()

const changeRole = async (row: sampleItemI) => setRolePowerData({ role_id: props.roleId, data_id: row.data_id, data_level: row.data_level })
</script>

<template>
  <el-table :data="tableData" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
    <el-table-column property="data_name" label="全部" width="160" />
    <el-table-column label="数据权限">
      <template #default="scope">
        <el-radio-group v-model="scope.row.data_level" class="ml-4" @change="changeRole(scope.row)">
          <el-radio :label="0" size="large">
            本人相关
          </el-radio>
          <el-radio :label="1" size="large">
            本部门相关
          </el-radio>
          <el-radio :label="2" size="large">
            本部门及以下部门相关
          </el-radio>
          <el-radio :label="3" size="large">
            全部
          </el-radio>
        </el-radio-group>
      </template>
    </el-table-column>
  </el-table>
</template>
