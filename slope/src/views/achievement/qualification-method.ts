import type { UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import type { pageI } from '@/utils/tools'
import api, { baseURL } from '@/api'

export const loading = ref(false)

export interface resQualificationTableItemI {
  aptitude_id: string
  aptitude_name: string
  cert_number: string
  aptitude_type: string
  aptitude_grade: string
  department_id: string
  original_amount: number
  extant_original_amount: number
  original_keeper: string
  principal_phone: string
  department: string
}

export interface getQualificationTableListI extends pageI {
  aptitude_type?: string
  aptitude_name?: string
  aptitude_grade?: string
}

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export const getAptitudeList = async (params: getQualificationTableListI) => {
  const res: any = await api.get('/aptitude/getAptitudeList', { params: { ...params } })
  return { list: res.data.list, total: res.data.total }
}

export const getAptitude = async (aptitude_id: string) => {
  const res: any = await api.get(`/aptitude/getAptitude?aptitude_id=${aptitude_id}`)
  return res.data
}

export const primaryAptitudeTypeOption = ['勘察', '设计', '咨询、规划、审查', '地质灾害治理', '测绘',
  '试验检测', '工商财务', '管理体系', '其他', '涉外', '安全生产', '施工']
export const primaryAptitudeGradeOption = ['甲级', '乙级', '丙级', '一级', '二级', '三级']
export const editId = ref('')

export interface qualificationFormDataI {
  aptitude_id?: string
  aptitude_name: string
  cert_number: string
  aptitude_type: string
  issuer: string
  department_id: string
  cert_valid_time: string
  aptitude_grade: string
  principal?: string
  principal_phone?: string
  original_keeper?: string
  original_amount?: number
  extant_original_amount?: number
  aptitude_description?: string
  cert_attachment?: string
  fileList?: UploadUserFile[]
}

export const formData: qualificationFormDataI = reactive<qualificationFormDataI>({
  aptitude_name: '',
  cert_number: '',
  aptitude_type: '',
  issuer: '',
  department_id: '',
  cert_valid_time: '',
  aptitude_grade: '',
  cert_attachment: '',
})

export interface resQualificationI {
  aptitude_id: string
  aptitude_name: string
  cert_number: string
  issuer: string
  aptitude_type: string
  department_id: string
  cert_valid_time: string
  aptitude_grade: string
  principal: string
  principal_phone: string
  original_keeper: string
  original_amount: number
  extant_original_amount: number
  aptitude_description: string
  cert_attachment: string
  registrant_user: string
  department: string
  cert_attachment_url: string
  cert_attachment_name: string
}

export const activeQualification: Ref<resQualificationI> = ref<resQualificationI>({
  aptitude_id: '',
  aptitude_name: '',
  cert_number: '',
  aptitude_type: '',
  department_id: '',
  issuer: '',
  cert_valid_time: '',
  aptitude_grade: '',
  principal: '',
  principal_phone: '',
  original_keeper: '',
  original_amount: 0,
  extant_original_amount: 0,
  aptitude_description: '',
  cert_attachment: '',
  registrant_user: '',
  department: '',
  cert_attachment_url: '',
  cert_attachment_name: '',
})

export const addAptitude = async (params: qualificationFormDataI) => api.post('/aptitude/addAptitude', params)
export const editAptitude = async (params: qualificationFormDataI) => api.post('/aptitude/editAptitude', params)

export const uploadAptitudeAttach = async (file: File) => {
  const res = await api.post('/aptitude/uploadAptitudeAttach', { file })
  return res.data
}

export const handleUploadFile = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadAptitudeAttach(obj.file)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.cert_attachment = res.file_id
  loading.value = false
}

export const getEditData = async (id: string) => {
  loading.value = true
  const res = await getAptitude(id)
  editId.value = res.aptitude_id
  formData.aptitude_name = res.aptitude_name
  formData.cert_number = res.cert_number
  formData.aptitude_type = res.aptitude_type
  formData.department_id = res.department_id
  formData.issuer = res.issuer
  formData.cert_valid_time = res.cert_valid_time
  formData.aptitude_grade = res.aptitude_grade
  formData.principal = res.principal
  formData.principal_phone = res.principal_phone.toString()
  formData.original_keeper = res.original_keeper
  formData.original_amount = res.original_amount
  formData.extant_original_amount = res.extant_original_amount
  formData.aptitude_description = res.aptitude_description
  if (res.cert_attachment_url) {
    formData.fileList = [{
      name: res.cert_attachment_name,
      url: baseURL + res.cert_attachment_url.slice(4),
    }]
  }
  loading.value = false
}

export const clearFormData = () => {
  loading.value = true
  editId.value = ''
  formData.aptitude_name = ''
  formData.cert_number = ''
  formData.aptitude_type = ''
  formData.department_id = ''
  formData.cert_valid_time = ''
  formData.aptitude_grade = ''
  formData.principal = ''
  formData.principal_phone = ''
  formData.original_keeper = ''
  formData.original_amount = 0
  formData.extant_original_amount = 0
  formData.aptitude_description = ''
  formData.cert_attachment = ''
  formData.fileList = []
  loading.value = false
}
