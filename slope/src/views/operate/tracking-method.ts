import type { UploadRequestOptions } from 'element-plus/lib/components'
import type { UploadUserFile } from 'element-plus'
import { uploadProjectAttach } from '@/views/operate/approval-method'
import api, { baseURL } from '@/api'
import type { tailItemI } from '@/views/operate/project-method'
import { getTailList } from '@/views/operate/project-method'

export const loading = ref(false)
export const editId = ref('')

export interface trackingFormDataI {
  tail_id?: string
  project_id: string
  project_code: string
  business_trip_users: string
  tail_start_time: string
  tail_end_time: string
  visiting_clients_company: string
  visiting_clients_man: string
  visiting_clients_man_phone: string
  subject: string
  purchase_way: string
  service_class: string
  business_relations: string
  docking_content: string
  follow_up_plan: string
  attachment: string
  others: string
  datePick?: string[]
  fileList?: UploadUserFile[]
}

export const formData: trackingFormDataI = reactive<trackingFormDataI>({
  project_id: '',
  project_code: '',
  business_trip_users: '',
  tail_start_time: '',
  tail_end_time: '',
  visiting_clients_company: '',
  visiting_clients_man: '',
  visiting_clients_man_phone: '',
  subject: '',
  purchase_way: '',
  service_class: '',
  business_relations: '',
  docking_content: '',
  follow_up_plan: '',
  attachment: '',
  others: '',
  datePick: [],
  fileList: [],
})

export const handleUploadFile = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res: any = await uploadProjectAttach(obj)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.attachment = res.file_id
  loading.value = false
}

export const clearFormData = () => {
  editId.value = ''
  formData.project_id = ''
  formData.project_code = ''
  formData.business_trip_users = ''
  formData.tail_start_time = ''
  formData.tail_end_time = ''
  formData.visiting_clients_company = ''
  formData.visiting_clients_man = ''
  formData.visiting_clients_man_phone = ''
  formData.subject = ''
  formData.purchase_way = ''
  formData.service_class = ''
  formData.business_relations = ''
  formData.docking_content = ''
  formData.follow_up_plan = ''
  formData.attachment = ''
  formData.others = ''
  formData.datePick = []
  formData.fileList = []
}

export const addTail = async (parameter: trackingFormDataI) => api.post('/project/addTail', parameter)
export const editTail = async (parameter: trackingFormDataI) => api.post('/project/editTail', parameter)
export const getDetail = async (tail_id: string, project_id: string) => {
  const tailList = await getTailList(project_id)
  const activeItem = tailList.find((item: tailItemI) => item.tail_id === tail_id)
  console.log(activeItem)
  formData.business_trip_users = activeItem.business_trip_users
  formData.visiting_clients_company = activeItem.visiting_clients_company
  formData.visiting_clients_man = activeItem.visiting_clients_man
  formData.visiting_clients_man_phone = activeItem.visiting_clients_man_phone
  formData.subject = activeItem.subject
  formData.purchase_way = activeItem.purchase_way
  formData.service_class = activeItem.service_class
  formData.business_relations = activeItem.business_relations
  formData.docking_content = activeItem.docking_content
  formData.follow_up_plan = activeItem.follow_up_plan
  formData.others = activeItem.others
  formData.datePick = [activeItem.tail_start_time, activeItem.tail_end_time]
  if (activeItem.attachment_url) {
    formData.attachment = activeItem.attachment
    formData.fileList = [{
      name: activeItem.attachment_name,
      url: baseURL + activeItem.attachment_url.slice(4),
    }]
  }
}
