import type { FormInstance, FormRules } from 'element-plus'
import type { Arrayable } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
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

interface tableItem {
  user_id: string
  user_name: string
  user_sex: string
  user_brithday: string
  user_phone: number
  user_email: string
  user_department_id: string
  user_role_id: string
  user_empno: string
  entry_time: string
  in_service: number
  user_age: number
  user_work_age: number
  in_service_label: string
  user_department_name: string
  user_organization_name: string
}

export const tableLoading = ref(false)
export const tableData = ref<tableItem[]>([])
export const getTableData = async (user_department_id = '') => {
  tableLoading.value = true
  const res: any = await getUserList(user_department_id)
  if (res.code === 0) {
    tableData.value = res.data
    tableLoading.value = false
  }
}
export const tableSelect = async (val: string) => {
  console.log(val)
  if (!val) await getTableData()
  else await getTableData(val)
}

export const searchName = async (val: string) => {
  if (!val) {
    await getTableData()
    return
  }
  const list: tableItem[] = []
  tableData.value.length && tableData.value.forEach(item => item.user_name.includes(val) && list.push(item))
  tableData.value = list
}

export const editTableItem = async (row: tableItem) => {
  console.log(row)
}
export const logoutTableItem = async (row: tableItem) => {
  console.log(row)
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}

export const addPerson = () => {

}

export const ruleFormRef = ref<FormInstance>()
export const rules: Partial<Record<string, Arrayable<any>>> = reactive<FormRules>({
  name: [{ required: true, message: '输入部门名称', trigger: 'blur' }],
  department: [{ required: true, message: '选择部门', trigger: 'change' }],
})
