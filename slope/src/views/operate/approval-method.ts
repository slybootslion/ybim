import type { UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import { makeCustomerList } from '@/views/achievement/contract-method'
import api from '@/api'

export const loading = ref(false)
export const editId = ref('')

export interface approvalFormDataI {
  project_name: string
  project_code: string
  project_type: string
  project_type_arr?: string[]
  project_dependency_country: string
  project_dependency_province: string
  project_dependency_city: string
  industry_type: string
  expect_amount: number
  proprietor_customer_id: string
  proprietor_linkman: string
  proprietor_linkman_phone: string
  business_partner: string
  business_partner_phone: string
  operation_department_id: string
  operation_user_id: string
  production_department_id: string
  production_user_id: string
  project_general: string
  attachment?: string
  others?: string
  pcas?: string[]
  fileList?: UploadUserFile[]
}

export const formData: approvalFormDataI = reactive<approvalFormDataI>({
  project_name: '',
  project_code: '',
  project_type: '',
  project_type_arr: [],
  project_dependency_country: '',
  project_dependency_province: '',
  project_dependency_city: '',
  industry_type: '',
  expect_amount: 0,
  proprietor_customer_id: '',
  proprietor_linkman: '',
  proprietor_linkman_phone: '',
  business_partner: '',
  business_partner_phone: '',
  operation_department_id: '',
  operation_user_id: '',
  production_department_id: '',
  production_user_id: '',
  project_general: '',
  attachment: '',
  others: '',
  pcas: [],
  fileList: [],
})

export const searchLoading = ref(false)
export const customerOptions = ref([])
export const getCustomerHandle = async (q: string) => {
  if (!q) q = ''
  searchLoading.value = true
  customerOptions.value = await makeCustomerList(q)
  searchLoading.value = false
}

export const uploadProjectAttach = async (obj: UploadRequestOptions) => {
  const res: any = await api.post('/project/uploadProjectAttach', { file: obj.file })
  if (res.code === 0) return res.data
  return undefined
}

export const handleUploadFile = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadProjectAttach(obj)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.attachment = res.file_id
  loading.value = false
}

export const addProject = async (parameter: approvalFormDataI) => api.post('/project/addProject', parameter)
export const clearFormData = () => {
  formData.project_name = ''
  formData.project_code = ''
  formData.project_type = ''
  formData.project_type_arr = []
  formData.project_dependency_country = ''
  formData.project_dependency_province = ''
  formData.project_dependency_city = ''
  formData.industry_type = ''
  formData.expect_amount = 0
  formData.proprietor_customer_id = ''
  formData.proprietor_linkman = ''
  formData.proprietor_linkman_phone = ''
  formData.business_partner = ''
  formData.business_partner_phone = ''
  formData.operation_department_id = ''
  formData.operation_user_id = ''
  formData.production_department_id = ''
  formData.production_user_id = ''
  formData.project_general = ''
  formData.attachment = ''
  formData.others = ''
  formData.pcas = []
  formData.fileList = []
}
