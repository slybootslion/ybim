<script setup lang="ts">
import type { getRecordTableListI } from '@/views/record-method'
import { getFilingList, pageData } from '@/views/record-method'

const getList = async (param: getRecordTableListI) => {
  const res = await getFilingList(param)
  pageData.total = res.total
}
getList(pageData)
</script>

<template>
  <div>record-research-table</div>
</template>

<style scoped lang="scss">
//
</style>
