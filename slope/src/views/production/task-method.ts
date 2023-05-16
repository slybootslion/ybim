import type { Ref } from 'vue'
import api from '@/api'

interface resTaskOpI {
  task_name: string
  taskCode: string
  department_id: string
  allocation_ratio: string
  production_user_id: string
  deadline: string
  task_explain: string
  department: string
  production_user: string
}

export interface resTaskDataI {
  project_name: string
  task_id: string
  project_id: string
  industry_type: string
  project_type: string
  major: string
  start_time: string
  end_time: string
  task_name: string
  task_code: string
  main_department_id: string
  allocation_ratio: string
  production_user_id: string
  deadline: string
  task_explain: string
  main_department: string
  production_user: string
  participating_organization: resTaskOpI[]
}

export const activeTaskData: Ref<resTaskDataI> = ref<resTaskDataI>({
  task_id: '',
  project_name: '',
  project_id: '',
  industry_type: '',
  project_type: '',
  major: '',
  start_time: '',
  end_time: '',
  task_name: '',
  task_code: '',
  main_department_id: '',
  allocation_ratio: '',
  production_user_id: '',
  deadline: '',
  task_explain: '',
  main_department: '',
  production_user: '',
  participating_organization: [],
})

export const getTask = async (task_id: string) => {
  const res = await api.get(`/produce/getTask?task_id=${ task_id }`)
  return res.data
}
