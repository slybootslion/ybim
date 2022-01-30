// pages/personnel-manage/add-groups/add-groups.js
import StorageCache from '../../../tools/storage-cache'
import GroupApi from '../../../api/personnel/group-model'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { company_list, worktype_list } = await StorageCache.getEquipmentInfo()

    const setdata = {
      company_list,
      worktype_list
    }

    const { group_id } = options
    if (group_id) {
      this.data.group_id = group_id
      const groupDetail = await StorageCache.getGroupDetail()
      setdata.group_name = groupDetail.group_name
      setdata.company_name = groupDetail.company_name
      setdata.company_id = groupDetail.company_id
      setdata.work_type_id = groupDetail.work_type_id
      setdata.work_name = worktype_list.find(w => w.kindwork_id === +groupDetail.work_type_id).work_name
      setdata.responsible = groupDetail.responsible
      setdata.responsible_card_no = groupDetail.responsible_card_no
      setdata.memo = groupDetail.memo
    }

    this.setData(setdata)
  },

  onGroupName(e) {
    this.data.group_name = e.detail.value
  },

  onResponsibleCardNo(e) {
    this.data.responsible_card_no = e.detail.value
  },

  onResponsible(e) {
    this.data.responsible = e.detail.value
  },

  onMemo(e) {
    this.data.memo = e.detail.value
  },

  onCompanyId(e) {
    const { value } = e.detail
    this.data.company_id = value
  },

  onGroupList(e) {
    const { value } = e.detail
    this.data.work_type_id = value
  },

  async submit() {
    const idCradReg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/
    const { group_name, responsible_card_no, responsible, memo, company_id, work_type_id, group_id } = this.data
    if (!group_name || !work_type_id || !company_id) {
      wx.lin.showToast({
        title: '必要信息未填写',
        icon: 'error',
      })
      return false
    }

    if (responsible_card_no && !idCradReg.test(responsible_card_no)) {
      wx.lin.showToast({
        title: '身份证不符合规范',
        icon: 'error'
      })
      return false
    }

    const submitData = {
      group_name,
      company_id,
      work_type_id,
      responsible: responsible ? responsible : '',
      responsible_card_no: responsible_card_no ? responsible_card_no : '',
      memo: memo ? memo : ''
    }

    if (group_id) {
      submitData.group_id = group_id
      await GroupApi.putGroupEdit(submitData)
    } else {
      await GroupApi.postGroupAdd(submitData)
    }
    wx.navigateBack()
  }

})