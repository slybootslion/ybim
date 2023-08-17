import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Arrayable } from '@vueuse/core'
import api from '@/api'
import { checkAuth } from '@/utils/tools'

export const addDepartment = async (department_parent_id: string, department_name: string) => {
  return api.post('/personnel/addDepartment', { department_parent_id, department_name })
}

interface addUserPar {
  user_name: string
  user_sex: string
  user_brithday: string
  user_phone: number
  user_email: string
  user_department_id: string
  user_role_id: string
  user_empno: string
  entry_time: string
}

interface editUserPar extends addUserPar {
  user_id: string
}

const addUser = async (parameter: addUserPar) => {
  return api.post('/personnel/addUser', parameter)
}

const editUser = async (parameter: editUserPar) => {
  return api.post('/personnel/editUser', parameter)
}

export const editDepartment = async (department_parent_id: string, department_name: string, department_id: string) => {
  return api.post('/personnel/editDepartment', { department_parent_id, department_name, department_id })
}
export const getDepartmentList = async () => {
  if (!checkAuth('PM00501001')) return
  return api.get('/personnel/getDepartmentList')
}

export const getUserList = async (user_department_id = '') => {
  if (!checkAuth('PM00501001')) return
  const res = await api.get(`/personnel/getUserList?user_department_id=${ user_department_id }`)
  return res.data
}

export const getRoleList: any = async () => {
  if (!checkAuth('PM00502001')) return
  const res = await api.get('/permission/getRoleList')
  return res.data
}

export interface RoleItem {
  role_id: string
  role_memo: string
  role_name: string
}

export const roleData = ref<RoleItem[]>([])

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
export const selectDepartment = ref<TreeNode[]>([])
export const getTreeList = async () => {
  const res: any = await getDepartmentList()
  treeData.value = res.data
  level3List.value = []
  level2List.value = []
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
  selectDepartment.value = level2List.value.concat(level3List.value)
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
  user_age: number | string
  user_work_age: number
  in_service_label: string
  user_department_name: string
  user_organization_name: string
}

export const tableLoading = ref(false)
export const tableData = ref<tableItem[]>([])
export const getTableData = async (user_department_id = '') => {
  tableLoading.value = true
  tableData.value = await getUserList(user_department_id)
  tableLoading.value = false
}
export const tableSelect = async (val: string) => {
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

export const logoutTableItem = async (row: tableItem) => {
  ElMessageBox.confirm(
    `将注销人员${ row.user_name }，是否继续？`,
    '注意',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(async () => {
    const res: any = await api.post('/personnel/lockUser', { user_id: row.user_id })
    await getTableData()
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: `${ row.user_name }已注销`,
      })
    }
  }).catch(console.log)
}
const editUserId = ref('')
export const drawerForm: Record<string, string | number> = reactive<addUserPar>({
  user_name: '',
  user_sex: '',
  user_brithday: '',
  user_phone: 0,
  user_email: '',
  user_role_id: '',
  user_empno: '',
  entry_time: '',
  user_department_id: '',
})
export const drawerShow = ref(false)
export const drawerTitle = ref('添加人员')
export const ruleFormRef = ref<FormInstance>()
export const addUserHandle = () => {
  editUserId.value = ''
  drawerForm.user_name = ''
  drawerForm.user_sex = ''
  drawerForm.user_brithday = ''
  drawerForm.user_empno = ''
  drawerForm.user_department_id = ''
  drawerForm.user_role_id = ''
  drawerForm.user_phone = ''
  drawerForm.user_email = ''
  drawerForm.entry_time = ''
  delete drawerForm.user_id
  setTimeout(() => ruleFormRef.value!.clearValidate(), 0)
  drawerShow.value = true
  drawerTitle.value = '添加人员'
}
export const editTableItem = async (row: tableItem) => {
  editUserId.value = row.user_id
  drawerForm.user_name = row.user_name
  drawerForm.user_sex = row.user_sex
  drawerForm.user_brithday = row.user_brithday
  drawerForm.user_empno = row.user_empno
  drawerForm.user_department_id = row.user_department_id
  drawerForm.user_role_id = row.user_role_id
  drawerForm.user_phone = row.user_phone.toString()
  drawerForm.user_email = row.user_email
  drawerForm.entry_time = row.entry_time
  drawerShow.value = true
  drawerTitle.value = '编辑人员'
}
export const drawerRules: Partial<Record<string, Arrayable<any>>> = reactive<FormRules>({
  user_name: [{ required: true, message: '输入人员姓名', trigger: 'blur' }],
  user_empno: [{ required: true, message: '输入工号', trigger: 'blur' }],
  user_sex: [{ required: true, message: '选择性别', trigger: 'change' }],
  user_brithday: [{ required: true, message: '选择生日', trigger: 'change' }],
  user_department_id: [{ required: true, message: '选择部门', trigger: 'change' }],
  user_role_id: [{ required: true, message: '选择权限', trigger: 'change' }],
  user_phone: [
    { required: true, message: '输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '输入正确手机号', trigger: ['blur', 'change'] },
  ],
  user_email: [
    { required: true, message: '输入邮箱', trigger: 'blur' },
    { type: 'email', message: '输入正确邮箱', trigger: ['blur', 'change'] },
  ],
  entry_time: [{ required: true, message: '输入入职时间', trigger: 'blur' }],
})
export const submitUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (!editUserId.value) {
        await formEl.validate(async (valid: boolean) => {
          if (valid) {
            const res: any = await addUser(drawerForm as unknown as addUserPar)
            if (res.code === 0) drawerShow.value = false
            await getTableData()
          }
        })
      } else { // edit
        drawerForm.user_id = editUserId.value
        const res: any = await editUser(drawerForm as unknown as editUserPar)
        if (res.code === 0) drawerShow.value = false
        await getTableData()
      }
    }
  })
}

export const rules: Partial<Record<string, Arrayable<any>>> = reactive<FormRules>({
  name: [{ required: true, message: '输入部门名称', trigger: 'blur' }],
  department: [{ required: true, message: '选择部门', trigger: 'change' }],
})
