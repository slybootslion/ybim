import type { FormInstance, UploadUserFile } from 'element-plus'
import type { UploadRequestOptions } from 'element-plus/lib/components'
import api from '@/api'
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
  const res: any = await api.get(`/science/getQuestsFileList?research_id=${research_id}`)
  return res.data
}
export const uploadProAttach: any = async (file: File) => {
  const res = await api.post('/science/uploadProAttach', { file })
  return res.data
}
export const addProject: any = async (data: projectDataI) => api.post('/science/addProject', data)

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
  pcas?: []
  participants_user_list?: []
  initiation_year_string?: string
  file_id?: string
}

interface FileItemI {
  'research_file_id': string
  'research_file_name': string
  'create_time': string
  'upload_user': string
  'file_url': string
}

export interface projectFileListI {
  prepare: FileItemI[]
  development: []
  inspection: FileItemI[]
  promotion: []
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
  start_time: '2021-02-03',
  end_time: '2023-03-09',
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
  participants_user_list: [],
  initiation_year_string: '2019',
  file_id: '',
})

export const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      console.log(formData)
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
      if (!formData.file_id) delete formData.file_id
      loading.value = true
      const res = await addProject(formData)
      if (res.code === 0) back()
      loading.value = false
    }
  })
}

export const fileList = ref<UploadUserFile[]>([])

export const handleUploadFile = async (obj: UploadRequestOptions) => {
  const res = await uploadProAttach(obj.file)
  formData.file_id = res.file_id
}

export const beforeUploadFile = () => {
  if (formData.file_id !== '') return false
}

export const handlePreviewFile = () => {
  console.log('handlePreview')
}

export const handleRemoveFile = () => formData.file_id = ''
