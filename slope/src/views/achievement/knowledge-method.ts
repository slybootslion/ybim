import api from '@/api'
import type { pageI } from '@/utils/tools'

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface resKnowledgeTableItemI {
  ip_id: string
  result_type: string
  request_code: string
  result_name: string
  property_owner: string
  copyright_owner: string
  application_year: number
  application_time: string
  validity: string
}

export interface getKnowledgeTableListI extends pageI {
  result_type?: string
  request_code?: string
  result_name?: string
  property_owner?: string
  copyright_owner?: string
  agent?: string
  application_year?: number
  application_time?: string
}

export const getIprList = async (params: getKnowledgeTableListI) => {
  const res = await api.get('/ipr/getIprList', { params: { ...params } })
  return { list: res.data.list, total: res.data.total }
}
