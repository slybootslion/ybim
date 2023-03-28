import type { FormInstance, FormRules } from 'element-plus'
import api from '@/api'

export const addDepartment = async (department_parent_id: string, department_name: string) => {
  return api.post('/personnel/addDepartment', { department_parent_id, department_name })
}

export const editDepartment = async (department_parent_id: string, department_name: string, department_id: string) => {
  return api.post('/personnel/editDepartment', { department_parent_id, department_name, department_id })
}
export const getDepartmentList = async () => api.get('/personnel/getDepartmentList')

export const getUserList = async (user_department_id = '') => api.get(`/personnel/getUserList?user_department_id=${ user_department_id }`)

export interface TreeNode {
  children?: TreeNode[]
  department_id: string
  department_parent_id: string
  department_name: string
  value?: string
  label?: string
}

export const treeData = ref<TreeNode[]>()
export const departmentList = ref<TreeNode[]>([])
export const level2List = ref<TreeNode[]>([])
export const level3List = ref<TreeNode[]>([])
export const getTreeList = async () => {
  const res = await getDepartmentList()
  treeData.value = res.data
  const flatTree = (node: TreeNode, level: number) => {
    node.value = node.department_id
    node.label = node.department_name
    if (level === 3) {
      level3List.value.push(node)
      return
    }
    if (level === 2) level2List.value.push(node)
    departmentList.value?.push(node)
    if (node.children?.length) {
      for (const child of node.children) {
        flatTree(child, level + 1)
      }
    }
  }
  flatTree(res.data[0], 1)
}

export const tableData = ref([])
export const getTableData = async () => {
  const res: any = await getUserList('')
  if (res.code === 0) tableData.value = res.data
}

export const ruleFormRef = ref<FormInstance>()
export const rules = reactive<FormRules>({
  name: [{ required: true, message: '输入部门名称', trigger: 'blur' }],
  department: [{ required: true, message: '选择部门', trigger: 'change' }],
})
