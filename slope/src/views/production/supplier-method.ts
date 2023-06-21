import type { FormInstance, UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import type { Ref } from 'vue'
import type { pageI } from '@/utils/tools'
import api, { baseURL } from '@/api'
import { back } from '@/views/scientific_research/project-method'

export const loading = ref(false)

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

export interface resSupplierI {
  supplier_id: string
  supplier_name: string
  supplier_type: string
  supplier_department: string
  primary_business: string
  address_province: string
  address_city: string
  address_detail: string
  linkman: string
  linkman_phone: string
  linkman_post: string
  registration_time: string
  supplier_general: string
  enterprise_qualification: string
  attachment: string
  registrant_user: string
  attachment_url: string
  attachment_name: string
}

export const activeSupplier: Ref<resSupplierI> = ref<resSupplierI>({
  supplier_id: '',
  supplier_name: '',
  supplier_type: '',
  supplier_department: '',
  primary_business: '',
  address_province: '',
  address_city: '',
  address_detail: '',
  linkman: '',
  linkman_phone: '',
  linkman_post: '',
  registration_time: '',
  supplier_general: '',
  enterprise_qualification: '',
  attachment: '',
  registrant_user: '',
  attachment_url: '',
  attachment_name: '',
})

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

export interface supplierFormDataI {
  supplier_id?: string
  supplier_name: string
  supplier_type: string
  primary_business: string
  address_province: string
  address_city: string
  address_detail: string
  linkman: string
  linkman_phone: string
  linkman_post: string
  supplier_general: string
  enterprise_qualification: string
  attachment: string
  pcas?: string[]
  fileList?: UploadUserFile[]
}

export const formData: supplierFormDataI = reactive<supplierFormDataI>({
  supplier_name: '',
  supplier_type: '',
  primary_business: '',
  address_province: '',
  address_city: '',
  address_detail: '',
  linkman: '',
  linkman_phone: '',
  linkman_post: '',
  supplier_general: '',
  enterprise_qualification: '',
  attachment: '',
  pcas: [],
  fileList: [],
})

const uploadSupplierAttach = async (file: File) => {
  const res = await api.post('/supplier/uploadSupplierAttach', { file })
  return res.data
}

export const handleUploadFile = async (obj: UploadRequestOptions) => {
  loading.value = true
  const res = await uploadSupplierAttach(obj.file)
  if (!res || !res.file_id) {
    loading.value = false
    return
  }
  formData.attachment = res.file_id
  loading.value = false
}
export const editId = ref('')

const addSupplier = async (p: supplierFormDataI) => await api.post('/supplier/addSupplier', p)
const editSupplier = async (p: supplierFormDataI) => await api.post('/supplier/editSupplier', p)

export const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      formData.address_province = (formData.pcas as string[])[0]
      formData.address_city = (formData.pcas as string[])[1]
      // delete formData.pcas
      // delete formData.fileList
      let res: any
      if (!editId.value) {
        res = await addSupplier(formData)
      } else {
        formData.supplier_id = editId.value
        res = await editSupplier(formData)
      }
      if (!res || res.code !== 0) {
        loading.value = false
        return
      }
      editId.value = ''
      loading.value = false
      back()
    }
  })
}

export const getSupplier = async (supplier_id: string) => {
  const res = await api.get(`/supplier/getSupplier?supplier_id=${ supplier_id }`)
  return res.data
}

export const getEditData = async (id: string) => {
  loading.value = true
  editId.value = id
  const res = await getSupplier(editId.value)
  formData.supplier_name = res.supplier_name
  formData.supplier_type = res.supplier_type
  formData.primary_business = res.primary_business
  formData.address_detail = res.address_detail
  formData.linkman = res.linkman
  formData.linkman_phone = res.linkman_phone
  formData.linkman_post = res.linkman_post
  formData.supplier_general = res.supplier_general
  formData.enterprise_qualification = res.enterprise_qualification
  formData.attachment = res.attachment
  formData.pcas = []
  formData.pcas = [res.address_province, res.address_city]
  if (res.attachment_name) formData.fileList = [{ name: res.attachment_name, url: baseURL + res.attachment_url.slice(4) }]
  loading.value = false
}
export const clearFormData = () => {
  loading.value = true
  editId.value = ''
  formData.supplier_name = ''
  formData.supplier_type = ''
  formData.primary_business = ''
  formData.address_province = ''
  formData.address_city = ''
  formData.address_detail = ''
  formData.linkman = ''
  formData.linkman_phone = ''
  formData.linkman_post = ''
  formData.supplier_general = ''
  formData.enterprise_qualification = ''
  formData.attachment = ''
  formData.pcas = []
  formData.fileList = []
  loading.value = false
}
