<script setup lang="ts">
import type { tableItemI } from '@/views/system/role-method'
import {tableHeaderCellStyle} from "@/utils/tools";
defineProps<{
  tableData: tableItemI[]
}>()
</script>

<template>
  <el-table :data="tableData" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
    <el-table-column label="序号" type="index" width="60" />
    <el-table-column property="user_name" label="姓名" width="110" />
    <el-table-column property="user_sex" label="性别" />
    <el-table-column property="user_age" label="年龄" />
    <el-table-column property="user_empno" label="工号" width="110" />
    <el-table-column property="user_organization_name" label="所属机构" width="200" />
    <el-table-column property="user_department_name" label="部门" width="120" />
    <el-table-column property="user_phone" label="手机号码" width="140" />
    <el-table-column property="user_email" label="企业邮箱" width="170" />
    <el-table-column property="user_work_age" label="司龄" />
    <el-table-column property="entry_time" label="入职时间" width="110" />
  </el-table>
</template>
