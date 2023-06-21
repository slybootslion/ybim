import type { UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import { uploadProjectAttach } from '@/views/operate/approval-method'
import api from '@/api'

export const loading = ref(false)
export const editId = ref('')

export interface contractReviewFormDataI {
  project_id: string
  contract_name: string
  first_party: string
  second_party: string
  contract_money: number
  contract_type: string
  responsible_person: string
  contract_general: string
  attention: string
  attachment: string
  contract_number: string
  fileList?: UploadUserFile[]
}

export const formData: contractReviewFormDataI = reactive<contractReviewFormDataI>({
  project_id: '',
  contract_name: '',
  first_party: '',
  second_party: '',
  contract_money: 0,
  contract_type: '',
  responsible_person: '',
  contract_general: '',
  attention: '',
  attachment: '',
  contract_number: '',
  fileList: [],
})

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

export const addContractReview = (params: contractReviewFormDataI) => api.post('/project/addContractReview', params)

export const clearFormData = () => {
  formData.project_id = ''
  formData.contract_name = ''
  formData.first_party = ''
  formData.second_party = ''
  formData.contract_money = 0
  formData.contract_type = ''
  formData.responsible_person = ''
  formData.contract_general = ''
  formData.attention = ''
  formData.attachment = ''
  formData.contract_number = ''
  formData.fileList = []
}
