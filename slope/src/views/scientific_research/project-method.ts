import type { FormInstance, UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import api, { baseURL } from '@/api'
import type { pageI } from '@/utils/tools'
import router from '@/router'
import { getUserList } from '@/views/system/personnel-method'

export const pageData = reactive<pageI>({
  page_size: 10, page_number: 1, total: 0,
})

export interface getProjectListParamI extends pageI {
  research_name?: string
  status?: number
  research_code?: string
  research_type?: string
  registrant_user?: string
  project_dependency_city?: string
  project_dependency_province?: string
}

export interface resProjectListI {
  create_time: string
  initiation_year: number
  project_dependency_city: string
  project_dependency_province: string
  registrant_user: string
  research_code: string
  research_id: string
  research_name: string
  research_type: string
  status: string
}

export const loading = ref(false)

export const getProjectList: any = async (parameter: getProjectListParamI) => {
  const res = await api.post('/science/getProjectList', parameter)
  return { list: res.data.list, total: res.data.total }
}
export const getProject: any = async (research_id: string) => {
  const res = await api.get(`/science/getProject?research_id=${ research_id }`)
  return res.data
}
export const getQuestsFileList: any = async (research_id: string) => {
  const res: any = await api.get(`/science/getQuestsFileList?research_id=${ research_id }`)
  return res.data
}
export const uploadProAttach: any = async (file: File) => {
  const res = await api.post('/science/uploadProAttach', { file })
  return res.data
}
export const getDownloadUrl: any = async (url: string) => {
  const res: any = await api.get(url)
  return res.data
}
export const addProject: any = async (data: projectDataI) => api.post('/science/addProject', data)
export const editProject: any = async (data: projectDataI) => api.post('/science/editProject', data)
export const personList = ref([])

export const getPersonData = async () => {
  loading.value = true
  personList.value = await getUserList()
  loading.value = false
}

export const addNew = () => router.push('/scientific-research/project-form')

export const back = () => router.back()

export const researchNameClick = async (row: resProjectListI) => router.push(`/scientific-research/project-detail?research_id=${ row.research_id }`)

export interface projectDataI {
  research_id?: string
  research_name?: string
  research_code?: string
  research_type?: string
  initiation_year?: number | string
  start_time?: string
  end_time?: string
  project_dependency_province?: string
  project_dependency_city?: string
  proprietor_customer_id?: string
  proprietor_customer?: string
  competent_department_id?: string
  competent_department?: string
  participating_department?: string
  participating_department_id?: string
  project_leader_user?: string
  project_leader_user_id?: string
  participants_user?: string | string[]
  participants_user_id?: string
  registrant_user?: string
  registrant_user_id?: string
  project_general?: string
  research_purpose?: string
  research_contents?: string
  performance?: string
  remarks?: string
  attachment?: string
  status?: number
  attachment_url?: string
  attachment_name?: string
  pcas?: string[]
  participants_user_list?: string[]
  initiation_year_string?: string
  file_id?: string
}

export interface fileItemI {
  'research_file_id': string
  'research_file_name': string
  'create_time': string
  'upload_user': string
  'file_url': string
}

export interface projectFileListI {
  prepare: fileItemI[]
  development: fileItemI[]
  inspection: fileItemI[]
  promotion: fileItemI[]
}

export const editId = ref('')

export const activeProjectData = ref<projectDataI>({})
export const activeProjectFileList = ref<projectFileListI>({
  prepare: [],
  development: [],
  inspection: [],
  promotion: [],
})
export const formData: projectDataI = reactive<projectDataI>({
  research_name: '标准项目名称',
  research_code: 'bzxj-901273987',
  research_type: '科研课题',
  start_time: '',
  end_time: '',
  pcas: [],
  initiation_year: 0,
  project_dependency_province: '',
  project_dependency_city: '',
  proprietor_customer_id: '',
  proprietor_customer: '',
  competent_department: '',
  competent_department_id: '',
  participating_department: '',
  project_leader_user: '',
  project_leader_user_id: '',
  participants_user: '',
  project_general: '',
  research_purpose: '',
  research_contents: '',
  performance: '',
  remarks: '',
  attachment_url: '',
  attachment_name: '',
  attachment: '',
  participants_user_list: [],
  initiation_year_string: '',
})

export const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      if (formData.participants_user_list && formData.participants_user_list.length) formData.participants_user_id = (formData.participants_user_list as string[]).join(',')
      formData.project_dependency_province = (formData.pcas as string[])[0]
      formData.project_dependency_city = (formData.pcas as string[])[1]
      formData.initiation_year = +(formData.initiation_year_string as string)
      delete formData.pcas
      delete formData.participants_user_list
      if (!formData.project_general) delete formData.project_general
      if (!formData.research_purpose) delete formData.research_purpose
      if (!formData.research_contents) delete formData.research_contents
      if (!formData.performance) delete formData.performance
      if (!formData.remarks) delete formData.remarks
      if (!formData.attachment) delete formData.attachment
      if (editId.value) {
        formData.research_id = editId.value
        const res = await editProject(formData)
        if (res.code === 0) back()
      } else {
        const res = await addProject(formData)
        if (res.code === 0) back()
      }
      editId.value = ''
      loading.value = false
    }
  })
}

export const fileList = ref<UploadUserFile[]>([])

export const handleUploadFile = async (obj: UploadRequestOptions) => {
  const res = await uploadProAttach(obj.file)
  formData.attachment = res.file_id
}

export const beforeUploadFile = () => {
  if (formData.attachment !== '') return false
}

export const handleRemoveFile = () => formData.attachment = ''
export const getEditData = async (ei: string) => {
  loading.value = true
  editId.value = ei
  const data = await getProject(editId.value)
  activeProjectData.value = data as unknown as projectDataI
  console.log(activeProjectData.value)
  formData.research_name = activeProjectData.value.research_name
  formData.research_code = activeProjectData.value.research_code
  formData.research_type = activeProjectData.value.research_type
  formData.initiation_year_string = activeProjectData.value.initiation_year!.toString()
  formData.start_time = activeProjectData.value.start_time
  formData.end_time = activeProjectData.value.end_time
  formData.proprietor_customer_id = activeProjectData.value.proprietor_customer_id
  formData.competent_department_id = activeProjectData.value.competent_department_id
  formData.project_leader_user_id = activeProjectData.value.project_leader_user_id
  formData.participating_department_id = activeProjectData.value.participating_department_id
  formData.participants_user_list = activeProjectData.value.participants_user_id!.split(',')
  formData.project_general = activeProjectData.value.project_general
  formData.research_purpose = activeProjectData.value.research_purpose
  formData.research_contents = activeProjectData.value.research_contents
  formData.pcas = [activeProjectData.value.project_dependency_province as string,
    activeProjectData.value.project_dependency_city as string]
  formData.performance = activeProjectData.value.performance
  formData.remarks = activeProjectData.value.remarks
  if (formData.attachment) {
    formData.attachment = activeProjectData.value.attachment
    fileList.value = [{ name: activeProjectData.value.attachment_name as string, url: baseURL + activeProjectData.value.attachment_url!.slice(4) }]
  }
  loading.value = false
}
export const cleanFormData = () => {
  loading.value = true
  editId.value = ''
  formData.research_name = ''
  formData.research_code = ''
  formData.research_type = ''
  formData.initiation_year_string = ''
  formData.start_time = ''
  formData.end_time = ''
  formData.proprietor_customer_id = ''
  formData.competent_department_id = ''
  formData.project_leader_user_id = ''
  formData.participating_department_id = ''
  formData.participants_user_list = []
  formData.project_general = ''
  formData.research_purpose = ''
  formData.research_contents = ''
  formData.pcas = []
  formData.performance = ''
  formData.remarks = ''
  loading.value = false
}
