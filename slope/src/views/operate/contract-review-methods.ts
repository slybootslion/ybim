export const loading = ref(false)
export const editId = ref('')

export interface contractReviewFormDataI {
  project_id: string
  contract_name: string
  first_party: string
  second_party: string
  contract_money: string
  contract_type: string
  responsible_person: string
  contract_general: string
  attention: string
  attachment: string
  contract_number: string
}

export const formData: contractReviewFormDataI = reactive<contractReviewFormDataI>({
  project_id: '',
  contract_name: '',
  first_party: '',
  second_party: '',
  contract_money: '',
  contract_type: '',
  responsible_person: '',
  contract_general: '',
  attention: '',
  attachment: '',
  contract_number: '',
})
