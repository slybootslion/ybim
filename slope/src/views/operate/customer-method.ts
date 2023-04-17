import api from '@/api'

export interface customerI {
  customer_id: string
  customer_name: string
}

export const customerList = ref<customerI[]>([])

export const getCustomers = async () => {
  const res = await api.get('/customer/getCustomers')
  return res.data
}

export const getCustomerList = async () => {
  customerList.value = await getCustomers()
}
