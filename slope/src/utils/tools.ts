import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'

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
  if (fileId !== '') {
    ElMessage.error('删除之前上传文件再重新上传')
    return false
  }
}

export const handleRemoveFile = async (obj: any, fileIdName: string) => {
  obj[fileIdName] = ''
}

// 将formData中，后端没有的字段剔除掉
export const filterMoreField = (formData: any) => {
  const filterStr = ['pcas', 'fileList', 'project_type_arr', 'primary_business_list', 'datePick', 'fileList1',
    'fileList2', 'fileList3', 'days', 'poArr', 'participants_user_list', 'application_year_str', 'majorArr']
  const data = cloneDeep(formData)
  for (let i = 0; i < filterStr.length; i++) {
    const f = filterStr[i]
    if (data[f]) delete data[f]
  }
  return data
}

export class TimerSimulateInterval {
  private clear: boolean
  private timer: number | undefined
  private countLimit: number

  constructor() {
    this.timer = undefined
    this.clear = false
    this.countLimit = 0
  }

  /*
  * 设置定时器，
  * 1参数：定时器回调
  * 2参数：每次定时器执行间隔时长，默认1秒
  * 3参数：定时器执行次数，默认5次，可传Infinity不限制次数
  * */
  simulateInterval({ callback, interval = 1000, countLimit = 5 }: {
    callback: any
    interval?: any
    countLimit?: any
  }) {
    let timerId: any
    this.clear = false
    this.countLimit = countLimit
    let c = 0
    const fn = () => {
      if (this.clear) return
      if (c >= this.countLimit) {
        this.simulateClearInterval()
        return
      }
      callback()
      const prevTimerId = timerId
      timerId = setTimeout(fn, interval)
      clearTimeout(prevTimerId)
      this.timer = timerId
      c++
    }

    setTimeout(fn, interval)
  }

  simulateClearInterval(callback?: Function) {
    clearTimeout(this.timer)
    this.clear = true
    callback && callback()
  }
}

export function tableHeaderCellStyle({ row, column, rowIndex, columnIndex }: never) {
  return {
    // textAlign: 'center',
    color: '#004da5',
    background: '#e9f2f5',
  }
}
