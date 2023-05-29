import type { FormRules } from 'element-plus'
import type { pageI } from '@/utils/tools'
import api, { baseURL } from '@/api'
import { getDownloadUrl } from '@/views/scientific_research/project-method'
import {FormInstance} from "element-plus";

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})
export const loading = ref(false)
export const projectId = ref('')

export interface approveItemI {
  approve_contents: string
  approve_time: string
  approve_result: string
  approve_user: string
}

export interface resProjectDataI {
  project_id: string
  project_name: string
  project_code: string
  project_type: string
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
  registration_time: string
  project_general: string
  attachment: string
  others: string
  proprietor_customer: string
  operation_department: string
  production_department: string
  operation_user: string
  production_user: string
  registrant_user: string
  attachment_url: string
  attachment_name: string
  approve_id: string
  project_approve: approveItemI[]
}

export const activeProjectData: Ref<resProjectDataI> = ref<resProjectDataI>({
  project_id: '',
  project_name: '',
  project_code: '',
  project_type: '',
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
  registration_time: '',
  project_general: '',
  attachment: '',
  others: '',
  proprietor_customer: '',
  operation_department: '',
  production_department: '',
  operation_user: '',
  production_user: '',
  registrant_user: '',
  attachment_url: '',
  attachment_name: '',
  approve_id: '',
  project_approve: [],
})

export interface getProjectListParamI extends pageI {
  project_name?: string
  project_code?: string
  project_type?: string
  project_dependency_country?: string
  project_dependency_province?: string
  project_dependency_city?: string
  industry_type?: string
  operation_user?: string
  production_user?: string
  project_status?: number
}

export const projectStatusOptions = {
  0: '待立项',
  1: '已立项',
  2: '招投标',
  3: '放弃',
  4: '放弃',
  5: '落标',
  6: '中标',
  7: '合同评审',
  8: '结束',
}

export interface resProjectListI {
  project_id: string
  project_code: string
  industry_type: string
  project_type: string
  project_dependency_province: string
  project_dependency_city: string
  expect_amount: number
  registration_time: string
  project_status_name: string
  operation_user: string
  production_user: string
  registrant_user: string
  proprietor_customer: string
}

export const getProjectList = async (parameter: getProjectListParamI) => {
  const res: any = await api.get('/project/getProjectList', { params: { ...parameter } })
  return { list: res.data.list, total: res.data.total }
}

export const downloadItem = async (url: string) => {
  loading.value = true
  const res = await getDownloadUrl(url.slice(4))
  window.open(baseURL + res.down_url.slice(3))
  loading.value = false
}

export interface approveFormDataI {
  approve_id: string
  approve_contents: string
  approve_result?: number
}

export const approveApi = async (params: approveFormDataI) => await api.post('/project/approve', params)

export const clearForm = (formData: any) => {
  formData.approve_contents = ''
  formData.approve_id = ''
  formData.approve_result = 0
}

export interface resContractReviewI {
  conre_id: string
  project_id: string
  contract_name: string
  contract_number: string
  first_party: string
  second_party: string
  contract_money: number
  contract_type: string
  responsible_person: string
  contract_general: string
  attention: string
  attachment: string
  attachment_url: string
  attachment_name: string
  approve_id: string
  conre_approve: approveItemI[]
}
export const activeContractReviewData: Ref<resContractReviewI> = ref<resContractReviewI>({
  conre_id: '',
  project_id: '',
  contract_name: '',
  contract_number: '',
  first_party: '',
  second_party: '',
  contract_money: 0,
  contract_type: '',
  responsible_person: '',
  contract_general: '',
  attention: '',
  attachment: '',
  attachment_url: '',
  attachment_name: '',
  approve_id: '',
  conre_approve: [],
})

export const getContractReview = async (project_id: string) => {
  const res: any = await api.get(`/project/getContractReview?project_id=${project_id}`)
  return res.data
}
export const rules = reactive<FormRules>({
  approve_result: [{ required: true, message: '选择审核结果', trigger: 'change' }],
  approve_contents: [{ required: true, message: '输入审核意见', trigger: 'blur' }],
})

export const approveSubmit = async (formEl: FormInstance | undefined, formData: approveFormDataI, cb: Function) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const res: any = await approveApi(formData)
      if (!res || res.code !== 0) {
        loading.value = false
        return
      }
      await cb()
      loading.value = false
      clearForm(formData)
    }
  })
}
export interface resTenderI {
  applicant_user: string
  tender_id: string
  project_id: string
  joint_bid: number
  joint_company: string
  earnest_money: number
  earnest_type: string
  tenderee: string
  main_bidder: string
  tender_agent: string
  purchase_way: string
  implement_solution: string
  operation_user_id: string
  apply_time: string
  receip_time: string
  opentender_time: string
  applicant_user_id: string
  applicant_time: string
  specific_note: string
  authorized_person: string
  authorized_person_code: string
  authorized_end_time: string
  authorized_attachment: string
  tender_offer: string
  win_tender_inform: string
  tender_documents: string
  tender_documents_note: string
  lost_tender_note: string
  tender_result: string
  win_time: string
  tender_money: string
  authorized_attachment_url: string
  authorized_attachment_name: string
  approve_id: string
  tender_approve: approveItemI[]
}
export const activeTenderData: Ref<resTenderI> = ref<resTenderI>({
  applicant_user: '',
  tender_id: '',
  project_id: '',
  joint_bid: 0,
  joint_company: '',
  earnest_money: 0,
  earnest_type: '',
  tenderee: '',
  main_bidder: '',
  tender_agent: '',
  purchase_way: '',
  implement_solution: '',
  operation_user_id: '',
  apply_time: '',
  receip_time: '',
  opentender_time: '',
  applicant_user_id: '',
  applicant_time: '',
  specific_note: '',
  authorized_person: '',
  authorized_person_code: '',
  authorized_end_time: '',
  authorized_attachment: '',
  tender_offer: '',
  win_tender_inform: '',
  tender_documents: '',
  tender_documents_note: '',
  lost_tender_note: '',
  tender_result: '',
  win_time: '',
  tender_money: '',
  authorized_attachment_url: '',
  authorized_attachment_name: '',
  approve_id: '',
  tender_approve: [],
})
