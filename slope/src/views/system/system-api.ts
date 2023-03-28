import api from '@/api'

export const addDepartment = async (department_parent_id: string, department_name: string) => {
  return api.post('/personnel/addDepartment', { department_parent_id, department_name })
}

export const editDepartment = async (department_parent_id: string, department_name: string, department_id: string) => {
  return api.post('/personnel/editDepartment', { department_parent_id, department_name, department_id })
}
export const getDepartmentList = async () => api.get('/personnel/getDepartmentList')
