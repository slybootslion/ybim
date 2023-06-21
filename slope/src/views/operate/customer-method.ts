import type { FormInstance } from 'element-plus'
import api from '@/api'
import type { pageI } from '@/utils/tools'
import { back } from '@/views/scientific_research/project-method'

export interface customerI {
  customer_id: string
  customer_name: string
}

export interface resCustomerItemI extends customerI {
  customer_department: string
  primary_business: string
  address_province: string
  address_city: string
  linkman: string
  linkman_phone: string
  linkman_post: string
  registration_time: string
  registrant_user: string
}

export const customerList = ref<customerI[]>([])
export const customerListTable = ref<resCustomerItemI[]>([])
export const getCustomers = async () => {
  const res = await api.get('/customer/getCustomers')
  return res.data
}

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface getCustomerTableListParamI {
  customer_name?: string
  customer_department?: string
  primary_business?: string
  address_province?: string
  address_city?: string
  address_detail?: string
  linkman?: string
  linkman_phone?: string
  linkman_post?: string
  customer_general?: string
  page_number: number
  page_size: number
}

export const getCustomerListTable = async (parameter: getCustomerTableListParamI) => {
  const res: any = await api.get('/customer/getCustomerList', { params: { ...parameter } })
  return { list: res.data.list, total: res.data.total }
}

export const getCustomerList = async () => {
  customerList.value = await getCustomers()
}

export interface customerDataI {
  customer_id?: string
  customer_name: string
  customer_department?: string
  primary_business: string
  primary_business_list?: string[]
  address_province: string
  address_city: string
  address_detail: string
  linkman: string
  linkman_phone: string
  linkman_post: string
  customer_general: string
  pcas?: string[]
}

export const formData: customerDataI = reactive<customerDataI>({
  customer_name: '',
  customer_department: '',
  primary_business: '',
  primary_business_list: [],
  address_province: '',
  address_city: '',
  address_detail: '',
  linkman: '',
  linkman_phone: '',
  linkman_post: '',
  customer_general: '',
  pcas: [],
})

export const loading = ref(false)
export const editId = ref('')
const addCustomer = async (parameter: customerDataI) => await api.post('/customer/addCustomer', parameter)
const editCustomer = async (parameter: customerDataI) => await api.post('/customer/editCustomer', parameter)
export const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      formData.address_province = (formData.pcas as string[])[0]
      formData.address_city = (formData.pcas as string[])[1]
      formData.primary_business = formData.primary_business_list!.join(',')
      if (!formData.customer_department) delete formData.customer_department
      // delete formData.pcas
      // delete formData.primary_business_list
      if (!editId.value) {
        await addCustomer(formData)
      } else {
        formData.customer_id = editId.value
        await editCustomer(formData)
      }
      editId.value = ''
      loading.value = false
      back()
    }
  })
}

export const getCustomer = async (customer_id: string) => {
  const res = await api.get(`/customer/getCustomer?customer_id=${ customer_id }`)
  return res.data
}

export const primaryBusinessOptions = ['规划科研', '技术咨询', '软件开发', '勘察设计', '检测监理', '全过程咨询',
  '材料供销', '系统集成', '劳务安装', '施工建造', '建设管理', '运营管理', '其它']

export const getEditData = async (id: string) => {
  loading.value = true
  editId.value = id
  const res = await getCustomer(id)
  formData.customer_name = res.customer_name
  formData.customer_department = res.customer_department
  formData.customer_general = res.customer_general
  formData.primary_business_list = res.primary_business.split(',')
  formData.address_detail = res.address_detail
  formData.linkman = res.linkman
  formData.linkman_phone = res.linkman_phone
  formData.linkman_post = res.linkman_post
  formData.pcas = []
  formData.pcas = [res.address_province as string, res.address_city as string]
  loading.value = false
}

export const cleanFormData = () => {
  loading.value = true
  editId.value = ''
  formData.customer_name = ''
  formData.customer_department = ''
  formData.customer_general = ''
  formData.primary_business = ''
  formData.primary_business_list = []
  formData.address_province = ''
  formData.address_city = ''
  formData.address_detail = ''
  formData.linkman = ''
  formData.linkman_phone = ''
  formData.linkman_post = ''
  formData.pcas = []
  loading.value = false
}
