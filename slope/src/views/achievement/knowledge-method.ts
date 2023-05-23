import type { UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import api from '@/api'
import type { pageI } from '@/utils/tools'

export const loading = ref(false)
export const editId = ref('')
export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface resKnowledgeTableItemI {
  ip_id: string
  result_type: string
  request_code: string
  result_name: string
  property_owner: string
  copyright_owner: string
  application_year: number
  application_time: string
  validity: string
}

export interface getKnowledgeTableListI extends pageI {
  result_type?: string
  request_code?: string
  result_name?: string
  property_owner?: string
  copyright_owner?: string
  agent?: string
  application_year?: number
  application_time?: string
}

export const getIprList = async (params: getKnowledgeTableListI) => {
  const res = await api.get('/ipr/getIprList', { params: { ...params } })
  return { list: res.data.list, total: res.data.total }
}

export interface iprFormDataI {
  result_type: string
  request_code: string
  result_name: string
  property_owner: string
  copyright_owner: string
  agent?: string
  application_year?: number
  application_year_str?: string
  application_time: string
  validity: string
  expiry_time: string
  application_department?: string
  linkman?: string
  yearly_payment?: string
  yearly_payment_time?: string
  other_attachment: string
  result_cert_attachment: string
  fileList1?: UploadUserFile[]
  fileList2?: UploadUserFile[]
}

export const formData: iprFormDataI = reactive<iprFormDataI>({
  result_type: '',
  request_code: '',
  result_name: '',
  property_owner: '',
  copyright_owner: '',
  agent: '',
  application_year: 0,
  application_year_str: '',
  application_time: '',
  validity: '',
  expiry_time: '',
  application_department: '',
  linkman: '',
  yearly_payment: '',
  yearly_payment_time: '',
  other_attachment: '',
  result_cert_attachment: '',
  fileList1: [],
  fileList2: [],
})

export interface resKnowledgeI {
  ip_id: string
  result_type: string
  request_code: string
  result_name: string
  property_owner: string
  copyright_owner: string
  agent: string
  application_year: number
  application_time: string
  validity: number
  expiry_time: number
  application_department: string
  linkman: string
  yearly_payment: string
  yearly_payment_time: string
  other_attachment: string
  result_cert_attachment: string
  other_attachment_url: string
  other_attachment_name: string
  result_cert_attachment_url: string
  result_cert_attachment_name: string
}

export const activeKnowledge: Ref<resKnowledgeI> = ref<resKnowledgeI>({
  ip_id: '',
  result_type: '',
  request_code: '',
  result_name: '',
  property_owner: '',
  copyright_owner: '',
  agent: '',
  application_year: 0,
  application_time: '',
  validity: 0,
  expiry_time: 0,
  application_department: '',
  linkman: '',
  yearly_payment: '',
  yearly_payment_time: '',
  other_attachment: '',
  result_cert_attachment: '',
  other_attachment_url: '',
  other_attachment_name: '',
  result_cert_attachment_url: '',
  result_cert_attachment_name: '',
})

export const getIpr = async (ip_id: string) => {
  const res = await api.get(`/ipr/getIpr?ip_id=${ip_id}`)
  return res.data
}

export const primaryResultTypeOptions = ['国际发明专利', '国家发明专利', '实用新型专利', '外观发明专利', '软件著作版权',
  '标准规范', '技术著作', '学术论文', '品牌商标', '奖项荣誉', '职业资格证', '技术职称证', '其他成果']

export const addIpr = (params: iprFormDataI) => api.post('/ipr/addIpr', params)

export const handleUploadFile1 = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await api.post('/ipr/uploadIprAttach', { file: obj.file })
  if (!res.data || !res.data.file_id) {
    loading.value = false
    return
  }
  formData.other_attachment = res.data.file_id
  loading.value = false
}

export const handleUploadFile2 = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await api.post('/contract/uploadContractAttach', { file: obj.file })
  if (!res.data || !res.data.file_id) {
    loading.value = false
    return
  }
  formData.result_cert_attachment = res.data.file_id
  loading.value = false
}
