import type { UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import { uploadProjectAttach } from '@/views/operate/approval-method'
import api from '@/api'

export const loading = ref(false)

export interface biddingFormDataI {
  project_id: string
  project_type: string
  joint_bid: number
  joint_company?: string
  earnest_money: number
  earnest_type: string
  tenderee: string
  main_bidder: string
  grade_scale: string
  tender_agent: string
  purchase_way: string
  implement_solution: string
  apply_time: string
  receip_time: string
  opentender_time: string
  applicant_time: string
  specific_note: string
  authorized_person: string
  authorized_person_code: string
  authorized_end_time: string
  authorized_attachment: string
  fileList?: UploadUserFile[]
}

export const formData: biddingFormDataI = reactive<biddingFormDataI>({
  project_id: '',
  project_type: '',
  joint_bid: 0,
  earnest_money: 0,
  earnest_type: '',
  tenderee: '',
  main_bidder: '',
  grade_scale: '',
  tender_agent: '',
  purchase_way: '',
  implement_solution: '',
  apply_time: '',
  receip_time: '',
  opentender_time: '',
  applicant_time: '',
  specific_note: '',
  authorized_person: '',
  authorized_person_code: '',
  authorized_end_time: '',
  authorized_attachment: '',
  fileList: [],
})
export const primaryPurchaseWayOptions = ['公开招标', '委托招标', '询价招标', '竞争磋商', '其他']

export const handleUploadFile = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res: any = await uploadProjectAttach(obj)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.authorized_attachment = res.file_id
  loading.value = false
}
export const editId = ref('')
export const clearFormData = () => {
  editId.value = ''
  formData.project_id = ''
  formData.project_type = ''
  formData.joint_bid = 0
  formData.earnest_money = 0
  formData.earnest_type = ''
  formData.tenderee = ''
  formData.main_bidder = ''
  formData.grade_scale = ''
  formData.tender_agent = ''
  formData.purchase_way = ''
  formData.implement_solution = ''
  formData.apply_time = ''
  formData.receip_time = ''
  formData.opentender_time = ''
  formData.applicant_time = ''
  formData.specific_note = ''
  formData.authorized_person = ''
  formData.authorized_person_code = ''
  formData.authorized_end_time = ''
  formData.authorized_attachment = ''
  formData.fileList = []
}

export const addTender = async (parameter: biddingFormDataI) => api.post('/project/addTender', parameter)
