import { ElLoading } from 'element-plus'

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
