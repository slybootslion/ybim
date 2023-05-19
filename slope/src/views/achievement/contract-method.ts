import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import api from '@/api'
import type { pageI } from '@/utils/tools'
import { projectSearchLoading } from '@/views/production/task-method'
import { getTreeList, level2List } from '@/views/system/personnel-method'
import { getSupplierList } from '@/views/production/supplier-method'
import { getCustomerListTable } from '@/views/operate/customer-method'

export const loading = ref(false)

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

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
})

export const firstPartyOption: Ref<any> = ref([])
export const firstPartyKeyOption = ref('')
export const secondPartyOption: Ref<any> = ref([])
export const secondPartyKeyOption = ref('')
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
    await makeSelfOptionList()
    firstPartyOption.value = level2List.value
    firstPartyKeyOption.value = 'department_name'
  } else {
    firstPartyOption.value = await makeCustomerList(query)
    firstPartyKeyOption.value = 'customer_name'
  }
  projectSearchLoading.value = false
}
export const remoteSecondPartyMethod = async (query: string) => {
  if (!checkPaymentIsEmpty()) return
  if (!query) query = ''
  projectSearchLoading.value = true
  if (formData.payment_type === '支出') {
    secondPartyOption.value = await makeSupplierList(query)
    secondPartyKeyOption.value = 'supplier_name'
  } else {
    await makeSelfOptionList()
    secondPartyOption.value = level2List.value
    secondPartyKeyOption.value = 'department_name'
  }
  projectSearchLoading.value = false
}
export const firstFocus = async () => remoteFirstPartyMethod('')
export const secondFocus = async () => remoteSecondPartyMethod('')
export const paymentTypeChange = () => {
  firstPartyOption.value = []
  firstPartyKeyOption.value = ''
  secondPartyOption.value = []
  secondPartyKeyOption.value = ''
  formData.first_party = ''
  formData.second_party = ''
}
