import type { FormInstance, UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import api, { baseURL } from '@/api'
import { back } from '@/views/scientific_research/project-method'
import type { pageI } from '@/utils/tools'

export interface filingFormI {
  filing_id?: string
  filing_type: string
  filing_province: string
  filing_city: string
  filing_url?: string
  filing_url_login_account?: string
  filing_url_login_password?: string
  filing_department?: string
  filing_platform: string
  responsible_person: string
  filing_time: string
  filing_valid_time: string
  valid_status?: number
  trick_lock?: number
  trick_lock_custodian?: string
  trick_lock_principal_phone?: string
  filing_cert?: number
  filing_cert_attachment?: string
  other: string
  pcas?: string[]
  fileList?: UploadUserFile[]
}

export const formData: filingFormI = reactive<filingFormI>({
  filing_type: '',
  filing_province: '',
  filing_city: '',
  responsible_person: '',
  filing_platform: '',
  filing_time: '',
  filing_valid_time: '',
  other: '',
  pcas: [],
})

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface getRecordTableListI extends pageI {
  filing_type?: string
  filing_province?: string
  filing_city?: string
  filing_department?: string
  filing_platform?: string
  responsible_person?: string
}

export interface resRecordItemI {
  filing_id: string
  filing_type: string
  filing_platform: string
  filing_department: string
  filing_province: string
  filing_city: string
  filing_valid_time: string
  filing_time: string
  valid_status: number
  valid: string
}

export interface resFilingI {
  filing_id: string
  filing_type: string
  filing_province: string
  filing_city: string
  filing_url?: string
  filing_url_login_account?: string
  filing_url_login_password?: string
  filing_department: string
  filing_platform: string
  responsible_person: string
  filing_time: string
  filing_valid_time: string
  valid_status: number
  trick_lock?: number
  trick_lock_custodian?: string
  trick_lock_principal_phone?: string
  filing_cert?: number
  filing_cert_attachment?: string
  other: string
  filing_cert_attachment_url?: string
  filing_cert_attachment_name?: string
}

export const activeFilingData: Ref<resFilingI> = ref<resFilingI>({
  filing_id: '',
  filing_type: '',
  filing_province: '',
  filing_city: '',
  filing_department: '',
  filing_platform: '',
  responsible_person: '',
  filing_time: '',
  filing_valid_time: '',
  valid_status: 0,
  other: '',
})

export const getFiling = async (filing_id: string) => {
  const res = await api.get(`/filing/getFiling?filing_id=${ filing_id }`)
  return res.data
}

export const getFilingList = async (paramter: getRecordTableListI) => {
  const res = await api.get('/filing/getFilingList', { params: { ...paramter } })
  return { list: res.data.list, total: res.data.total }
}

export const uploadFilingCertAttach = async (file: File) => {
  const res = await api.post('/filing/uploadFilingCertAttach', { file })
  return res.data
}

export const editId = ref('')
export const loading = ref(false)
const addFiling = async (parameter: filingFormI) => {
  const res = await api.post('/filing/addFiling', parameter)
  return res.data
}

const editFiling = async (paramter: filingFormI) => {
  const res: any = await api.post('/filing/editFiling', paramter)
  return res.code
}

export const delFiling = async (filing_id: string) => api.post('/filing/delFiling', { filing_id })

export const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      formData.filing_province = (formData.pcas as string[])[0]
      formData.filing_city = (formData.pcas as string[])[1]
      delete formData.pcas
      delete formData.fileList
      if (!editId.value) {
        await addFiling(formData)
      } else {
        formData.filing_id = editId.value
        await editFiling(formData)
      }
      loading.value = false
      back()
    }
  })
}
export const handleUploadFile = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadFilingCertAttach(obj.file)
  if (!res) {
    loading.value = false
    return
  }
  formData.filing_cert_attachment = res.file_id
  loading.value = false
}
export const beforeUploadFile = async () => {
  if (formData.filing_cert_attachment !== undefined) {
    ElMessage.error('删除之前上传文件再重新上传')
    return false
  }
}
export const handleRemoveFile = async () => formData.filing_cert_attachment = undefined
export const getEditData = async (id: string) => {
  loading.value = true
  editId.value = id
  const res = await getFiling(id)
  formData.filing_type = res.filing_type
  formData.pcas = [res.filing_province, res.filing_city]
  formData.filing_url = res.filing_url
  formData.filing_url_login_account = res.filing_url_login_account
  formData.filing_url_login_password = res.filing_url_login_password
  formData.filing_department = res.filing_department
  formData.filing_platform = res.filing_platform
  formData.responsible_person = res.responsible_person
  formData.filing_time = res.filing_time
  formData.filing_valid_time = res.filing_valid_time
  formData.valid_status = res.valid_status
  formData.trick_lock = res.trick_lock
  formData.trick_lock_custodian = res.trick_lock_custodian
  formData.trick_lock_principal_phone = res.trick_lock_principal_phone
  formData.filing_cert = res.filing_cert
  formData.filing_cert_attachment = res.filing_cert_attachment
  formData.other = res.other
  if (res.filing_cert_attachment_name) {
    formData.fileList = [{
      name: res.filing_cert_attachment_name,
      url: baseURL + res.filing_cert_attachment_name.slice(4),
    }]
  }
  loading.value = false
}
export const clearFormData = () => {
  loading.value = true
  editId.value = ''
  formData.filing_type = ''
  formData.filing_province = ''
  formData.filing_city = ''
  formData.filing_url = ''
  formData.filing_url_login_account = ''
  formData.filing_url_login_password = ''
  formData.filing_department = ''
  formData.filing_platform = ''
  formData.responsible_person = ''
  formData.filing_time = ''
  formData.filing_valid_time = ''
  delete formData.valid_status
  delete formData.filing_cert
  delete formData.trick_lock
  formData.trick_lock_custodian = ''
  formData.trick_lock_principal_phone = ''
  formData.filing_cert_attachment = ''
  formData.other = ''
  formData.pcas = []
  loading.value = false
}
