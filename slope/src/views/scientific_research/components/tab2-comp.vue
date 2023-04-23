<script setup lang="ts">
import type { projectFileListI } from '@/views/scientific_research/project-method'

const props = defineProps<{
  detailFileList: projectFileListI
}>()

watchEffect(() => {
  console.log(props.detailFileList)
})
</script>

<template>
  <div>tab2-comp</div>
</template>

<style scoped lang="scss">

</style>
