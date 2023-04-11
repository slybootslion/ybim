import api from '@/api'
import type { pageI } from '@/utils/tools'

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface getProjectListParamI extends pageI {
  research_name?: string
  status?: number
  research_code?: string
  research_type?: string
  registrant_user?: string
  project_dependency_city?: string
  project_dependency_province?: string
}

export interface resProjectListI {
  create_time: string
  initiation_year: number
  project_dependency_city: string
  project_dependency_province: string
  registrant_user: string
  research_code: string
  research_id: string
  research_name: string
  research_type: string
  status: string
}
export const getProjectList: any = async (parameter: getProjectListParamI) => {
  const res = await api.post('/science/getProjectList', parameter)
  return { list: res.data.list, total: res.data.total }
}

export const addNew = () => {
  console.log('addNew')
}
