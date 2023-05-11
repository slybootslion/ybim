import type { pageI } from '@/utils/tools'
import api from '@/api'
import { delItemHandle } from '@/utils/tools'

export interface resSupplierTableItemI {
  supplier_id: string
  supplier_name: string
  supplier_type: string
  primary_business: string
  address_province: string
  address_city: string
  linkman: string
  linkman_phone: string
  linkman_post: string
  registration_time: string
  registrant_user: string
}

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface getSupplierTableListI extends pageI {
  supplier_name?: string
  address_province?: string
  address_city?: string
  supplier_type?: string
}

export const primarySupplierTypeOption = ['科研资讯', '勘察设计', '施工安装', '装备制造', '办公采购', '其他']
export const getSupplierList = async (paramter: getSupplierTableListI) => {
  const res = await api.get('/supplier/getSupplierList', { params: { ...paramter } })
  return { list: res.data.list, total: res.data.total }
}
