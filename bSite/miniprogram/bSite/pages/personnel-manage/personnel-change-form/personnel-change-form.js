// pages/personnel-manage/personnel-change-form/personnel-change-form.js
import StorageCache from '../../../tools/storage-cache'
import ChangeApi from '../../../api/personnel/change-model'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_list: [],
    group_list: [],
    active_group_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },

  async init() {
    const { empli, company_list, group_list } = await StorageCache.getEmpList()
    this.setData({
      company_list, group_list, empli
    })
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

  showWarning() {
    wx.lin.showToast({
      title: '未选择参建单位',
      icon: 'error'
    })
  },

  showEmptyWarning() {
    wx.lin.showToast({
      title: '所选项无内容',
      icon: 'error'
    })
  },

  async submit() {
    let { empli, group_id, company_id } = this.data
    if (!group_id || !company_id) {
      wx.lin.showToast({
        title: '必要信息未选择',
        icon: 'error'
      })
      return false
    }
    this.setData({ btnDisabled: true })
    empli = empli.map(emp => {
      emp.company_id = company_id
      emp.group_id = group_id
      delete emp.checked
      return emp
    })
    const res = await ChangeApi.postRostersAdd({
      empli: JSON.stringify(empli)
    })
    if (res) {
      await StorageCache.removeEmpList()
      wx.reLaunch({
        url: '/pages/application/application'
      })
    }
    this.setData({ btnDisabled: false })
  }
})