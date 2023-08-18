<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus'
import type { funItemI } from '@/views/system/role-method'
import { setRolePowerMenus, spanRow } from '@/views/system/role-method'
import { tableHeaderCellStyle } from '@/utils/tools'

const props = defineProps<{
  tableData: funItemI[]
  roleId: string
}>()

interface tableLineItemI {
  level1?: funItemI
  level2?: funItemI
  level3?: funItemI[]
}

let tableLineItem = reactive<tableLineItemI>({})
let tableLineData = reactive<tableLineItemI[]>([])
let activeLevel1: funItemI
const flatDataHandle = (tableDataItem: funItemI, level: number) => {
  if (level === 1) {
    activeLevel1 = tableDataItem
    tableLineItem.level1 = tableDataItem
    for (const level2Item of tableDataItem.children) flatDataHandle(level2Item, 2)
  }
  if (level === 2) {
    if (!tableLineItem.level1) tableLineItem.level1 = activeLevel1
    tableLineItem.level2 = tableDataItem
    for (let i = 0; i < tableDataItem.children.length; i++) {
      const item = tableDataItem.children[i]
      if (!tableLineItem.level3 || !tableLineItem.level3.length) tableLineItem.level3 = []
      tableLineItem.level3.push(item)
    }
    tableLineData.push(tableLineItem)
    tableLineItem = {}
  }
}

watchEffect(() => {
  if (props.tableData.length) {
    tableLineData = []
    for (const tableDataItem of props.tableData) flatDataHandle(tableDataItem, 1)
  }
})

interface SpanMethodProps {
  row: funItemI
  column: TableColumnCtx<funItemI>
  rowIndex: number
  columnIndex: number
}

const option = [
  { index: 0, field: 'level1' },
  { index: 1, field: 'level2' },
  { index: 2, field: 'level3' },
]
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  return spanRow({ row, column, rowIndex, columnIndex },
    tableLineData,
    option)
}
const menu_ids = ref<string[]>([])
const findLineChecked = (line: tableLineItemI) => {
  const l1 = line!.level1
  if (l1!.checked && !menu_ids.value.includes(l1!.menu_id)) menu_ids.value.push(l1!.menu_id)
  const l2 = line.level2
  if (l2?.checked) menu_ids.value.push(l2!.menu_id)
  const l3 = line.level3
  if (l3) for (const l3el of l3!) if (l3el.checked) menu_ids.value.push(l3el.menu_id)
}
const changeRole = async (menu_name: string, menu_id: string) => {
  menu_ids.value = []
  for (let i = 0; i < tableLineData.length; i++) {
    const line = tableLineData[i]
    findLineChecked(line)
  }
  await setRolePowerMenus({ role_id: props.roleId, menu_ids: menu_ids.value.join(',') })
}
</script>

<template>
  <el-table :data="tableLineData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px" stripe :header-cell-style="tableHeaderCellStyle">
    <el-table-column label="全部" width="220">
      <template #default="scope">
        <el-checkbox
          v-model="scope.row.level1.checked" :label="scope.row.level1.menu_name" size="large"
          @change="changeRole(scope.row.level1.menu_name, scope.row.level1.menu_id)"
        />
      </template>
    </el-table-column>
    <el-table-column label="模块" width="220">
      <template #default="scope">
        <el-checkbox
          v-model="scope.row.level2.checked" :label="scope.row.level2.menu_name" size="large"
          @change="changeRole(scope.row.level2.menu_name, scope.row.level2.menu_id)"
        />
      </template>
    </el-table-column>
    <el-table-column label="详细功能">
      <template #default="scope">
        <el-checkbox
          v-for="item in scope.row.level3" :key="item.menu_id" v-model="item.checked"
          :label="item.menu_name" size="large" @change="changeRole(item.menu_name, item.menu_id)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
