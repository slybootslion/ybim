import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
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
export interface tableItem {
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
export const tabLoading = ref(false)
export const UserListData = ref<tableItem[]>([])
export const activeName = ref('角色成员')
export const changeActive = async (data: RoleItem) => {
  tabLoading.value = true
  activeRoleId.value = data.role_id
  activeRoleName.value = data.role_name
  // 角色成员
  UserListData.value = await getUserList(activeRoleId.value)
  tabLoading.value = false
}
export const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
