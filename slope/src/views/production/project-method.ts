import type { pageI } from '@/utils/tools'
import api from '@/api'

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export const primaryIndustryTypeOptions = ['公路', '市政', '建筑', '园林', '水利', '电力', '环保', '其他']
export const primaryMajorTypeOption = ['路线总体', '路基路面', '桥涵结构', '隧道轨道', '机电交安', '给水排水',
  '工民建筑', '建筑结构', '水暖电器', '园林景观', '空间规划', '产业规划', '水利环保', '电力新源', '岩土地质', '检测养护',
  '工程造价', '安全评估', '工程造价', '安全评估', 'BIM咨询', '智慧工地', '智慧运营', '软件开发', '项目管理', '其他']
export const loading = ref(false)

export interface getProjectTableListI extends pageI {
  project_name?: string
  project_type?: string
  industry_type?: string
  project_dependency_country?: string
  project_dependency_province?: string
  project_dependency_city?: string
  task_name?: string
  task_code?: string
  main_department?: string
  production_user?: string
}

export interface resProjectTableItemI {
  task_id: string
  project_id: string
  project_name: string
  project_code: string
  project_type: string
  project_dependency_country: string
  project_dependency_province: string
  project_dependency_city: string
  industry_type: string
  task_name: string
  task_code: string
  production_user: string
  main_department: string
}

export const getProjectList = async (paramter: getProjectTableListI) => {
  const res = await api.get('/produce/getTaskList', { params: { ...paramter } })
  return { list: res.data.list, total: res.data.total }
}

export interface projectFormDataI {
  task_id?: string
  project_id: string
  industry_type: string
  project_type: string
  major: string
  start_time: string
  end_time: string
  task_code: string
  main_department_id: string
  allocation_ratio: string
  production_user_id: string
  deadline: string
  task_explain: string
  participating_organization: string
  task_name: string
}

export const formData: projectFormDataI = reactive<projectFormDataI>({
  project_id: '',
  industry_type: '',
  project_type: '',
  major: '',
  start_time: '',
  end_time: '',
  task_code: '',
  main_department_id: '',
  allocation_ratio: '',
  production_user_id: '',
  deadline: '',
  task_explain: '',
  participating_organization: '',
  task_name: '',
})
