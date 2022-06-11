// pages/personnel-manage/attendance-statistics/attendance-statistics.js
import AttendanceApi from '../../../api/attendance/attendance-model'
import BaseDataApi from '../../../api/base-data/base-data-model'
import { permissionHide } from '../../../tools/utils'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    companyName: {},
    companies: [],
    isLoading: true,
    showPopup: false,
    data_all: {},
    data_group: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onShow(options) {
    permissionHide(this, 469)
    const companies = await this.getCompany()
    const companyName = companies[0]
    this.setData({
      companies,
      companyName,
    })
    this.getData()
  },

  async getCompany() {
    const res = await BaseDataApi.getCompany()
    return res.data
  },

  async handleDateChange(params) {
    this.data.s_date = params.detail
    this.getData()
  },

  async getData() {
    const { companyName, s_date } = this.data
    if (!companyName.builing_id || !s_date) return
    this.setData({ isLoading: true })
    const { data_all, data_group } = await AttendanceApi.getTimecardsStat({ s_date, builing_id: companyName.builing_id })
    this.setData({ isLoading: false, data_group, data_all })
  },

  selectCompany() {
    this.setData({ showPopup: true })
  },

  popupItemClick(e) {
    this.data.builing_id = +e.target.id
    const companyName = this.data.companies.find(c => c.builing_id === this.data.builing_id)
    this.setData({
      companyName,
      showPopup: false,
    })
    this.getData()
  },

  groupItemTap(e) {
    if (this.data.hide) return
    const group_id = e.currentTarget.dataset.groupId
    let { builing_id, s_date } = this.data
    if (!builing_id) builing_id = this.data.companyName.builing_id
    wx.navigateTo({
      url: '/pages/personnel-manage/group-attendance-detail/group-attendance-detail?group_id=' + group_id + '&builing_id=' + builing_id + '&s_date=' + s_date,
    })
  },
})
