// pages/personnel-manage/submit-add-workers/submit-add-workers.js
import StorageCache from '../../../tools/storage-cache'
import RosterApi from '../../../api/personnel/roster-model'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },

  async init() {
    this.setData({ isLoading: true })
    const { company_list, edubackground_list, group_list, inspace_list, job_list, jobrole_list, sex_list, worktype_list } = await RosterApi.getWorkersInfo()
    const idCardDetail = await StorageCache.getIdCardDetail()
    this.setData({ isLoading: false, company_list, edubackground_list, group_list, inspace_list, job_list, jobrole_list, sex_list, worktype_list, idCardDetail })
  },

  onMobilePhone(e) {
    const { value } = e.detail
    this.data.mobile_phone = value
  },

  onJobRole(e) {
    const { value } = e.detail
    this.data.job_role = value
  },

  onWorktypeId(e) {
    const { value } = e.detail
    this.data.worktype_id = value
  },

  onEdubackgroundId(e) {
    const { value } = e.detail
    this.data.edubackground_id = value
  },

  onCompanyId(e) {
    const { value } = e.detail
    const active_group_list = this.data.group_list.filter(group => +group.company_id === +value)
    this.setData({
      group_id: '',
      group_name: '',
      company_id: value,
      active_group_list
    })
  },

  onGroupList(e) {
    const { value } = e.detail
    this.data.group_id = value
  },

  onInSpace(e) {
    const { value } = e.detail
    this.data.in_space = value
  },

  onJobId(e) {
    const { value } = e.detail
    this.data.job_id = value
  },

  async submit() {
    const { mobile_phone, job_role, worktype_id, edubackground_id,
      company_id, group_id, in_space, job_id } = this.data

    const reg = /^1[3-9]\d{9}$/
    if (!reg.test(mobile_phone)) {
      this.showToast('手机号不正确')
      return
    }

    if (!mobile_phone || !job_role || !worktype_id || !company_id || !group_id || !in_space) {
      this.showToast('必要信息未填写')
      return
    }

    const data = { mobile_phone, job_role, worktype_id, company_id, group_id, in_space, ...this.data.idCardDetail }
    data.edubackground_id = edubackground_id ? edubackground_id : 0
    data.job_id = job_id ? job_id : 0
    const res = await RosterApi.postWorkersAdd(data)
    await StorageCache.removeIdCardDetail()
    wx.navigateTo({
      url: `/pages/personnel-manage/person-info/person-info?emp_id=${res.emp_id}&hideNavBtn=${true}`,
    })
  },

  showEmptyWarning() {
    this.showToast('所选项无内容')
  },

  showWarning() {
    this.showToast('未选择参建单位')
  },

  showToast(title, icon = 'error') {
    wx.lin.showToast({
      title,
      icon,
    })
  }
})