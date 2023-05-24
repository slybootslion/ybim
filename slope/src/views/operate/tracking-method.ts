export const loading = ref(false)

export interface trackingFormDataI {
  project_id: string
  project_code: string
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
}

export const formData: trackingFormDataI = reactive<trackingFormDataI>({
  project_id: '',
  project_code: '',
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
})
