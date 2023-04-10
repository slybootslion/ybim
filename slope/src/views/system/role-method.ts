import type { FormInstance, FormRules } from 'element-plus'
import type { Arrayable } from '@vueuse/core'
import type { RoleItem } from '@/views/system/personnel-method'
import { getRoleList, roleData } from '@/views/system/personnel-method'
import api from '@/api'

export interface userRole {
  role_name: string
}

export const addRole = (parameter: any) => {
  return api.post('/permission/addRole', parameter)
}
export const editRole = (parameter: any) => {
  return api.post('/permission/editRole', parameter)
}
export const getUserList = async (role_id: string) => {
  const res: any = await api.get(`/permission/getUserList?role_id=${ role_id }`)
  return res.data
}
export const getRolePowerMenus = async (role_id: string) => {
  const res: any = await api.get(`/permission/getRolePowerMenus?role_id=${ role_id }`)
  return res.data
}
export const setRolePowerMenus = async (parameter: any) => {
  const res: any = await api.post('/permission/setRolePowerMenus', parameter)
  return res.data
}
export const getRolePowerData = async (role_id: string) => {
  const res: any = await api.get(`/permission/getRolePowerData?role_id=${ role_id }`)
  return res.data
}
export const setRolePowerData = async (parameter: any) => {
  const res: any = await api.post('/permission/setRolePowerData', parameter)
  return res.data
}
export const activeRoleName = ref('')
export const activeRoleId = ref('')
export const getRole = async () => {
  roleData.value = await getRoleList()
  if (activeRoleId.value === '') {
    activeRoleId.value = roleData.value[0].role_id
    activeRoleName.value = roleData.value[0].role_name
  }
}
export const editRoleId = ref('')
export const dialogShow = ref(false)

export const dialogForm: Record<string, string> = reactive<userRole>({
  role_name: '',
})
export const ruleFormRef = ref<FormInstance>()
export const rules: Partial<Record<string, Arrayable<any>>> = reactive<FormRules>({
  role_name: [{ required: true, message: '输入角色名称', trigger: 'blur' }],
})

export const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (!editRoleId.value) {
    // new
    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        const role_name = dialogForm.role_name
        await addRole({ role_name, role_memo: role_name })
        await getRole()
        dialogShow.value = false
      }
    })
  } else {
    await formEl.validate(async (valid: boolean) => {
      if (valid) {
        const role_name = dialogForm.role_name
        const role_id = editRoleId.value
        await editRole({ role_name, role_memo: role_name, role_id })
        await getRole()
        dialogShow.value = false
      }
    })
  }
}
export const addNew = () => {
  dialogForm.role_name = ''
  editRoleId.value = ''
  dialogShow.value = true
}

export const editRoleHandle = (data: RoleItem) => {
  dialogForm.role_name = data.role_name
  editRoleId.value = data.role_id
  dialogShow.value = true
}

export interface tableItemI {
  'user_id': string
  'user_name': string
  'user_sex': string
  'user_brithday': string
  'user_phone': number
  'user_email': string
  'user_department_id': string
  'user_role_id': string
  'user_empno': string
  'entry_time': string
  'in_service': number
  'user_age': number
  'user_work_age': number
  'in_service_label': string
  'user_department_name': string
  'user_organization_name': string
}

export interface funItemI {
  'menu_id': string
  'menu_parent_id': string
  'menu_name': string
  'is_menu': number
  'checked': boolean
  'children': funItemI[]
}

export interface sampleItemI {
  'data_id': string
  'data_name': string
  'data_level': number
}

export const tabLoading = ref(false)
export const UserListData = ref<tableItemI[]>([])
export const FunListData = ref<funItemI[]>([])
export const SampleListData = ref<sampleItemI[]>([])
export const activeName = ref('角色成员')
export const changeActive = async (data: RoleItem) => {
  tabLoading.value = true
  activeRoleId.value = data.role_id
  activeRoleName.value = data.role_name
  // 角色成员
  UserListData.value = await getUserList(activeRoleId.value)
  // 功能权限
  FunListData.value = await getRolePowerMenus(activeRoleId.value)
  // 数据权限
  SampleListData.value = await getRolePowerData(activeRoleId.value)
  tabLoading.value = false
}
// 合并表格
let rowspanArray: any

export function spanRow ({ rowIndex, columnIndex }: any, data: any, option: any) {
  if (rowIndex === 0 && columnIndex === 0) computeSpanRow(data, option)
  if (is(option, columnIndex)) {
    const rowspan = rowspanArray[columnIndex][rowIndex]
    const colspan = rowspan > 0 ? 1 : 0
    return { rowspan, colspan }
  }
  return { rowspan: 1, colspan: 1 }
}

function computeSpanRow (data: any, option: any) {
  rowspanArray = []
  const tempRow = []
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < option.length; j++) {
      const index = option[j].index
      const field = option[j].field

      if (i === 0) {
        tempRow[index] = 0
        rowspanArray[index] = []
        rowspanArray[index].push(1)
      } else {
        if (data[i][field] === data[i - 1][field]) {
          rowspanArray[index][tempRow[index]] += 1
          rowspanArray[index].push(0)
        } else {
          rowspanArray[index].push(1)
          tempRow[index] = i
        }
      }
    }
  }
}

function is (option: any, index: any) {
  for (let i = 0; i < option.length; i++) {
    if (option[i].index === index) {
      return true
    }
  }
  return false
}
