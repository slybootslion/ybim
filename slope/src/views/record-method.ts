import type { FormInstance, UploadUserFile } from 'element-plus'
import api from '@/api'
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
  trick_lock: number
  trick_lock_custodian?: string
  trick_lock_principal_phone?: string
  filing_cert: number
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
  trick_lock: 0,
  filing_cert: 0,
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

export const getFilingList = async (paramter: getRecordTableListI) => {
  const res = await api.get('/filing/getFilingList', { params: { ...paramter } })
  console.log(res)
  return { list: res.data.list, total: res.data.total }
}

// export const fileList = ref<UploadUserFile[]>([])
export const editId = ref('')
export const loading = ref(false)
const addFiling = async (parameter: filingFormI) => api.post('/filing/addFiling', parameter)
export const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      formData.filing_province = (formData.pcas as string[])[0]
      formData.filing_city = (formData.pcas as string[])[1]
      delete formData.pcas
      if (!editId.value) {
        console.log(formData)
        await addFiling(formData)
      } else {
        console.log('edit')
      }
      loading.value = false
      back()
    }
  })
}
export const handleUploadFile = async () => {
}
export const beforeUploadFile = async () => {
}
export const handleRemoveFile = async () => {
}
