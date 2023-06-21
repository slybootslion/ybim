import type { UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { InputHTMLAttributes } from 'vue'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import api from '@/api'
import { uploadProjectAttach } from '@/views/operate/approval-method'

export const loading = ref(false)
export const editId = ref('')

export interface bidFormDataI {
  project_id?: string
  project_general: string
  tender_id: string
  tender_result: string
  win_bidder?: string
  win_time?: string
  tender_money: number
  tender_offer: string
  win_tender_inform: string
  tender_documents: string
  tender_documents_note: string
  lost_tender_note: string
  fileList1?: UploadUserFile[]
  fileList2?: UploadUserFile[]
  fileList3?: UploadUserFile[]
}

export const formData: bidFormDataI = reactive<bidFormDataI>({
  project_id: '',
  project_general: '',
  tender_id: '',
  tender_result: '',
  win_bidder: '',
  win_time: '',
  tender_money: 0,
  tender_offer: '',
  win_tender_inform: '',
  tender_documents: '',
  tender_documents_note: '',
  lost_tender_note: '',
  fileList1: [],
  fileList2: [],
  fileList3: [],
})

export const getTender = async (project_id: string) => {
  const res = await api.get(`/project/getTender?project_id=${project_id}`)
  return res.data
}

export const getProject = async (project_id: string) => {
  const res = await api.get(`/project/getProject?project_id=${project_id}`)
  return res.data
}

export const projectHandle = async (id: string) => {
  const tenderRes = await getTender(id)
  if (!tenderRes || tenderRes.length === 0) {
    ElMessage.error('项目无投标信息')
    formData.project_general = ''
    formData.project_id = ''
    return
  }
  const projectRes = await getProject(id)
  formData.tender_id = tenderRes.tender_id
  formData.project_general = projectRes.project_general
}

export const selectBlur = (e: FocusEvent) => formData.win_bidder = (e.target as InputHTMLAttributes).value

export const selectChange = (s: string) => formData.win_bidder = s

export const handleUploadFile1 = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadProjectAttach(obj)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.tender_offer = res.file_id
  loading.value = false
}

export const handleUploadFile2 = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadProjectAttach(obj)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.win_tender_inform = res.file_id
  loading.value = false
}

export const handleUploadFile3 = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadProjectAttach(obj)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.tender_documents = res.file_id
  loading.value = false
}

export const registerTenderResult = (params: bidFormDataI) => api.post('/project/registerTenderResult', params)

export const clearFormData = () => {
  formData.project_id = ''
  formData.project_general = ''
  formData.tender_id = ''
  formData.tender_result = ''
  formData.win_bidder = ''
  formData.win_time = ''
  formData.tender_money = 0
  formData.tender_offer = ''
  formData.win_tender_inform = ''
  formData.tender_documents = ''
  formData.tender_documents_note = ''
  formData.lost_tender_note = ''
  formData.fileList1 = []
  formData.fileList2 = []
  formData.fileList3 = []
}
