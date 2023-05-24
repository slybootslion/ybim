import type { pageI } from '@/utils/tools'
import api from '@/api'

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface getProjectListParamI extends pageI {
  project_name?: string
  project_code?: string
  project_type?: string
  project_dependency_country?: string
  project_dependency_province?: string
  project_dependency_city?: string
  industry_type?: string
  operation_user?: string
  production_user?: string
  project_status?: number
}

export const projectStatusOptions = {
  0: '待立项',
  1: '已立项',
  2: '招投标',
  3: '放弃',
  4: '放弃',
  5: '落标',
  6: '中标',
  7: '合同评审',
  8: '结束',
}

export interface resProjectListI {
  project_id: string
  project_code: string
  industry_type: string
  project_type: string
  project_dependency_province: string
  project_dependency_city: string
  expect_amount: number
  registration_time: string
  project_status_name: string
  operation_user: string
  production_user: string
  registrant_user: string
  proprietor_customer: string
}

export const getProjectList = async (parameter: getProjectListParamI) => {
  const res: any = await api.get('/project/getProjectList', { params: { ...parameter } })
  return { list: res.data.list, total: res.data.total }
}
