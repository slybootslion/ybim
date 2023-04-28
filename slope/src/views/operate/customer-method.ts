import api from '@/api'
import type { pageI } from '@/utils/tools'

export interface customerI {
  customer_id: string
  customer_name: string
}

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export const customerList = ref<customerI[]>([])

export const getCustomers = async () => {
  const res = await api.get('/customer/getCustomers')
  return res.data
}

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

export const getCustomerList = async () => {
  customerList.value = await getCustomers()
}
