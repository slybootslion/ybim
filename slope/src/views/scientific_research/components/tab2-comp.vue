<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus/lib/components'
import type { fileItemI, projectFileListI } from '@/views/scientific_research/project-method'
import { getDownloadUrl } from '@/views/scientific_research/project-method'
import api, { baseURL } from '@/api'
import {tableHeaderCellStyle} from "@/utils/tools";

const props = defineProps<{
  detailFileList: projectFileListI
  researchId: string
}>()
const emit = defineEmits(['uploadSuccess'])

const loading = ref(false)
const downloadItem = async (row: fileItemI) => {
  loading.value = true
  const res = await getDownloadUrl(row.file_url.slice(4))
  window.open(baseURL + res.down_url.slice(3))
  loading.value = false
}

const uploadQuestsFile = async (obj: UploadRequestOptions, research_file_type: number) => {
  loading.value = true
  const research_id = props.researchId
  const res: any = await api.post('/science/uploadQuestsFile', { file: obj.file, research_id, research_file_type })
  console.log(res)
  if (res.code === 0) emit('uploadSuccess')
  loading.value = false
}
const upload0 = (obj: UploadRequestOptions) => uploadQuestsFile(obj, 0)
const upload1 = (obj: UploadRequestOptions) => uploadQuestsFile(obj, 1)
const upload2 = (obj: UploadRequestOptions) => uploadQuestsFile(obj, 2)
const upload3 = (obj: UploadRequestOptions) => uploadQuestsFile(obj, 3)
</script>

<template>
  <div v-loading="loading">
    <div class="block">
      <el-descriptions title="研究准备阶段" :column="1">
        <el-descriptions-item class-name="top">
          <el-upload :http-request="upload0" :show-file-list="false">
            <el-button type="primary">
              上传资料
            </el-button>
          </el-upload>
          <el-button>全部下载</el-button>
        </el-descriptions-item>
        <el-descriptions-item>
          <el-table :data="detailFileList.prepare" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
            <el-table-column prop="research_file_name" label="文件">
              <template #default="scope">
                <el-button link type="primary" @click="downloadItem(scope.row)">
                  {{ scope.row.research_file_name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="upload_user" label="上传人" width="200" />
            <el-table-column prop="create_time" label="上传时间" width="260" />
            <el-table-column label="操作" width="160">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="downloadItem(scope.row)">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="block">
      <el-descriptions title="研究试验与开发" :column="1">
        <el-descriptions-item class-name="top">
          <el-upload :http-request="upload1" :show-file-list="false">
            <el-button type="primary">
              上传资料
            </el-button>
          </el-upload>
          <el-button>全部下载</el-button>
        </el-descriptions-item>
        <el-descriptions-item>
          <el-table :data="detailFileList.development" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
            <el-table-column prop="research_file_name" label="文件">
              <template #default="scope">
                <el-button link type="primary" @click="downloadItem(scope.row)">
                  {{ scope.row.research_file_name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="upload_user" label="上传人" width="200" />
            <el-table-column prop="create_time" label="上传时间" width="260" />
            <el-table-column label="操作" width="160">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="downloadItem(scope.row)">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="block">
      <el-descriptions title="验收阶段" :column="1">
        <el-descriptions-item class-name="top">
          <el-upload :http-request="upload2" :show-file-list="false">
            <el-button type="primary">
              上传资料
            </el-button>
          </el-upload>
          <el-button>全部下载</el-button>
        </el-descriptions-item>
        <el-descriptions-item>
          <el-table :data="detailFileList.inspection" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
            <el-table-column prop="research_file_name" label="文件">
              <template #default="scope">
                <el-button link type="primary" @click="downloadItem(scope.row)">
                  {{ scope.row.research_file_name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="upload_user" label="上传人" width="200" />
            <el-table-column prop="create_time" label="上传时间" width="260" />
            <el-table-column label="操作" width="160">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="downloadItem(scope.row)">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="block">
      <el-descriptions title="成果推广应用" :column="1">
        <el-descriptions-item class-name="top">
          <el-upload :http-request="upload3" :show-file-list="false">
            <el-button type="primary">
              上传资料
            </el-button>
          </el-upload>
          <el-button>全部下载</el-button>
        </el-descriptions-item>
        <el-descriptions-item>
          <el-table :data="detailFileList.promotion" border style="width: 100%" stripe :header-cell-style="tableHeaderCellStyle">
            <el-table-column prop="research_file_name" label="文件">
              <template #default="scope">
                <el-button link type="primary" @click="downloadItem(scope.row)">
                  {{ scope.row.research_file_name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="upload_user" label="上传人" width="200" />
            <el-table-column prop="create_time" label="上传时间" width="260" />
            <el-table-column label="操作" width="160">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="downloadItem(scope.row)">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style scoped lang="scss">
.block {
  margin-top: 10px;
  :deep(.el-descriptions__body) {
    padding: 0 20px;
    white-space: pre-wrap;
  }
  :deep(.top ) {
    display: flex;
    justify-content: space-between;
  }
}
</style>
