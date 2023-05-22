import type { UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import api, { baseURL } from '@/api'
import type { pageI } from '@/utils/tools'
import { projectSearchLoading, remoteMethod } from '@/views/production/task-method'
import { getTreeList, level2List } from '@/views/system/personnel-method'
import { getSupplierList } from '@/views/production/supplier-method'
import { getCustomerListTable } from '@/views/operate/customer-method'

export const loading = ref(false)

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})
export const editId = ref('')

export interface resContractListItemI {
  contract_id: string
  project_id: string
  project_name: string
  industry_type: string
  rank_size: string
  contract_name: string
  contract_number: string
  contract_type: string
  payment_type: string
  contract_money: number
  first_party: string
  second_party: string
  sign_time: string
  registrant_user_id: string
  create_time: string
  registrant_user: string
  operation_department: string
}

export interface getContractListI extends pageI {
  payment_type?: string
  contract_type?: string
  industry_type?: string
  operation_department?: string
  project_name?: string
}

export const contractTypeOptions = ['自营', '挂靠', '科研', '其他']

export const industryTypeOption = ['公路', '市政', '建筑', '园林', '水利', '电力', '环保', '其他']

export const getContractList = async (paramter: getContractListI) => {
  const res = await api.get('/contract/getContractList', { params: { ...paramter } })
  return { list: res.data.list, total: res.data.total }
}

export interface contractFormDataI {
  contract_id?: string
  project_id: string
  contract_name: string
  contract_number: string
  first_party: string
  second_party: string
  contract_money: number
  contract_type: string
  payment_type: string
  industry_type: string
  rank_size: string
  sign_time: string
  operation_department_id: string
  project_scale: string
  attention: string
  attachment: string
  fileList?: UploadUserFile[]
}

export const formData: contractFormDataI = reactive<contractFormDataI>({
  project_id: '',
  contract_name: '',
  contract_number: '',
  first_party: '',
  second_party: '',
  contract_money: 0,
  contract_type: '',
  payment_type: '',
  industry_type: '',
  rank_size: '',
  sign_time: '',
  operation_department_id: '',
  project_scale: '',
  attention: '',
  attachment: '',
  fileList: [],
})

export const firstPartyOption: Ref<any> = ref([])
export const firstPartyKeyOption = ref('')
export const firstPartyLabelOption = ref('')
export const secondPartyOption: Ref<any> = ref([])
export const secondPartyKeyOption = ref('')
export const secondPartyLabelOption = ref('')
const checkPaymentIsEmpty = () => {
  if (!formData.payment_type) {
    ElMessage.error('先选择收支类型')
    return false
  }
  return true
}
const makeSelfOptionList = async () => {
  await getTreeList()
}
makeSelfOptionList()
const makeCustomerList = async (query: string) => {
  const r = await getCustomerListTable({ page_size: 8, page_number: 1, customer_name: query })
  return r.list
}
const makeSupplierList = async (query: string) => {
  const r = await getSupplierList({ page_size: 8, page_number: 1, supplier_name: query })
  return r.list
}
export const remoteFirstPartyMethod = async (query: string) => {
  if (!checkPaymentIsEmpty()) return
  if (!query) query = ''
  projectSearchLoading.value = true
  if (formData.payment_type === '支出') {
    firstPartyOption.value = level2List.value
    firstPartyKeyOption.value = 'department_id'
    firstPartyLabelOption.value = 'department_name'
  } else {
    firstPartyOption.value = await makeCustomerList(query)
    firstPartyKeyOption.value = 'customer_id'
    firstPartyLabelOption.value = 'customer_name'
  }
  projectSearchLoading.value = false
}
export const remoteSecondPartyMethod = async (query: string) => {
  if (!checkPaymentIsEmpty()) return
  if (!query) query = ''
  projectSearchLoading.value = true
  if (formData.payment_type === '支出') {
    secondPartyOption.value = await makeSupplierList(query)
    secondPartyKeyOption.value = 'supplier_id'
    secondPartyLabelOption.value = 'supplier_name'
  } else {
    secondPartyOption.value = level2List.value
    secondPartyKeyOption.value = 'department_id'
    secondPartyLabelOption.value = 'department_name'
  }
  projectSearchLoading.value = false
}
export const paymentTypeChange = () => {
  firstPartyOption.value = []
  firstPartyKeyOption.value = ''
  secondPartyOption.value = []
  secondPartyKeyOption.value = ''
  formData.first_party = ''
  formData.second_party = ''
}

const subIndustryTypeOptions1 = ['高速公路', '一级路', '二级路', '三级路', '四级路', '等外路']
const subIndustryTypeOptions2 = ['快速路', '主干路', '次干路', '支路']
const subIndustryTypeOptions3 = ['民用建筑', '公用建筑', '工业建筑']
export const activeSubIndTypeOptions = ref<string[]>([])
export const industryTypeChange = (v: string) => {
  if (v === '公路') activeSubIndTypeOptions.value = subIndustryTypeOptions1
  else if (v === '市政') activeSubIndTypeOptions.value = subIndustryTypeOptions2
  else if (v === '建筑') activeSubIndTypeOptions.value = subIndustryTypeOptions3
  else activeSubIndTypeOptions.value = []
}
export const uploadContractAttach = async (file: File) => {
  const res = await api.post('/contract/uploadContractAttach', { file })
  return res.data
}
export const handleUploadFile = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadContractAttach(obj.file)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.attachment = res.file_id
  loading.value = false
}

export const addContract = async (params: contractFormDataI) => api.post('/contract/addContract', params)
export const editContract = async (params: contractFormDataI) => api.post('/contract/editContract', params)

export const getContract = async (contract_id: string) => {
  const res = await api.get(`/contract/getContract?contract_id=${ contract_id }`)
  return res.data
}

export interface resEditDataI {
  contract_id: string
  project_id: string
  project_name: string
  contract_name: string
  contract_number: string
  first_party: string
  second_party: string
  contract_money: number
  contract_type: string
  payment_type: string
  industry_type: string
  rank_size: string
  sign_time: string
  operation_department_id: string
  project_scale: string
  attention: string
  attachment: string
  create_time: string
  operation_department: string
  first_party_name: string
  second_party_name: string
  registrant_user: string
  attachment_url: string
  attachment_name: string
}

export const getEditData = async (id: string) => {
  loading.value = true
  await remoteMethod('')
  const res: resEditDataI = await getContract(id)
  editId.value = res.contract_id
  formData.contract_type = res.contract_type
  formData.project_id = res.project_id
  formData.contract_name = res.contract_name
  formData.contract_number = res.contract_number
  formData.first_party = res.first_party
  formData.second_party = res.second_party
  formData.contract_money = res.contract_money
  formData.payment_type = res.payment_type
  formData.industry_type = res.industry_type
  formData.rank_size = res.rank_size
  formData.sign_time = res.sign_time
  formData.operation_department_id = res.operation_department_id
  formData.project_scale = res.project_scale
  formData.attention = res.attention
  formData.attachment = res.attachment
  formData.fileList = [{
    name: res.attachment_name,
    url: baseURL + res.attachment_url.slice(4),
  }]
  await remoteFirstPartyMethod('')
  await remoteSecondPartyMethod('')
  loading.value = false
}

export const clearFormData = () => {
  loading.value = true
  editId.value = ''
  formData.project_id = ''
  formData.contract_name = ''
  formData.contract_number = ''
  formData.first_party = ''
  formData.second_party = ''
  formData.contract_money = 0
  formData.contract_type = ''
  formData.payment_type = ''
  formData.industry_type = ''
  formData.rank_size = ''
  formData.sign_time = ''
  formData.operation_department_id = ''
  formData.project_scale = ''
  formData.attention = ''
  formData.attachment = ''
  formData.fileList = []
  loading.value = false
}

export const activeContract: Ref<resEditDataI> = ref<resEditDataI>({
  contract_id: '',
  project_id: '',
  project_name: '',
  contract_name: '',
  contract_number: '',
  first_party: '',
  second_party: '',
  contract_money: 0,
  contract_type: '',
  payment_type: '',
  industry_type: '',
  rank_size: '',
  sign_time: '',
  operation_department_id: '',
  project_scale: '',
  attention: '',
  attachment: '',
  create_time: '',
  operation_department: '',
  first_party_name: '',
  second_party_name: '',
  registrant_user: '',
  attachment_url: '',
  attachment_name: '',
})
