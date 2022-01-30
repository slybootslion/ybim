// pages/personnel-manage/personnel-change/personnel-change.js
import ChangeApi from '../../../api/personnel/change-model'
import StorageCache from '../../../tools/storage-cache'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    empli: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData()
  },

  async getData() {
    this.setData({ isLoading: true })
    const res = await ChangeApi.getRostersList()
    const { company_list, group_list, roster_list } = res
    this.setData({
      isLoading: false,
      company_list,
      group_list,
      roster_list
    })
  },

  handleCheck(e) {
    const item = e.detail
    if (item.checked) {
      this.data.empli.push(item)
    } else {
      const { empli } = this.data
      this.data.empli = empli.filter(liItem => liItem.emp_id !== item.emp_id)
    }
  },

  async submit() {
    const { empli, company_list, group_list } = this.data

    if (!empli.length) {
      wx.lin.showToast({
        title: '未选择人员',
        icon: 'error'
      })
      return false
    }

    await StorageCache.setEmpList({
      empli, company_list, group_list
    })

    wx.navigateTo({
      url: '/pages/personnel-manage/personnel-change-form/personnel-change-form',
    })
  }
})