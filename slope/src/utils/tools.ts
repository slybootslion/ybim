import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

export const pageLoading = () => {
  return ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(255, 255, 255, 0.7)',
  })
}

export interface pageI {
  page_size: number
  page_number: number
  total?: number
}

export const delItemHandle = (msg: string, cb: Function, params: any) => {
  ElMessageBox.confirm(`确定删除 ${msg} 这条记录？`, '注意', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await cb(params)
  }).catch(console.log)
}

export const beforeUploadFile = async (fileId: string) => {
  console.log(fileId)
  if (fileId !== '') {
    ElMessage.error('删除之前上传文件再重新上传')
    return false
  }
}

export const handleRemoveFile = async (obj: any, fileIdName: string) => {
  obj[fileIdName] = ''
}
