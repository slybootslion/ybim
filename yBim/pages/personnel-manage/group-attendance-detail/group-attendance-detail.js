// pages/attendance-manage/group-attendance-detail/group-attendance-detail.js
import AttendanceApi from '../../../api/attendance/attendance-model'
import { navigationBarHeight } from '../../../tools/system-info'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    group_id: '',
    builing_id: '',
    pageTitle: '班组考勤详情',
    s_date: '',
    isLoading: true,
    list: [],
    groupName: '',
    total: 0,
    popupShow: false,
    currentId: null,
    disabled: false,
    defaultSelectDate: '',
    isBatch: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.group_id = options.group_id
    this.data.builing_id = options.builing_id
    this.setData({
      msgTop: navigationBarHeight(),
      s_date: options.s_date
    })
    this.getData()
  },

  async handleDateChange(params) {
    this.data.s_date = params.detail
    this.getData()
  },

  async getData() {
    const { group_id, s_date } = this.data
    if (!s_date || !group_id) return
    this.setData({ isLoading: true })
    const { data: list, total } = await AttendanceApi.getGroupTime({ s_date, group_id })
    if (!list) {
      setTimeout(() => wx.navigateBack(), 3000)
      return
    }
    list.forEach(item => (item.checked = false))
    const groupName = list[0].group_name
    this.setData({ list, groupName, total, isLoading: false })
  },

  batchAttendance() {
    if (this.data.list.every(item => !item.checked)) {
      wx.lin.showToast({
        title: '先勾选需批量考勤组员',
        icon: 'error',
      })
      return false
    }
    this.setData({ popupShow: true, isBatch: true })
  },

  handleInput(e) {
    const { value } = e.detail
    this.data.workhour = value
  },

  itemCheck(e) {
    const { index } = e.currentTarget.dataset
    const { list } = this.data
    list[index].checked = !list[index].checked
    this.setData({ list })
  },

  itemClick(e) {
    const { currentId } = e.currentTarget.dataset
    this.setData({ popupShow: true, currentId, isBatch: false })
  },

  async handleSubmit() {
    const { workhour, list, currentId, s_date, group_id, builing_id, isBatch } = this.data
    this.setData({ disabled: true })
    if (!workhour || workhour > 24) return
    let emp_list = []
    if (currentId && !isBatch) {
      emp_list = [currentId]
    } else {
      emp_list = list.filter(item => item.checked).map(item => item.emp_id)
    }
    const data = {
      workhour,
      emp_list,
      s_date,
      group_id,
      builing_id
    }
    list.forEach(item => {
      if (emp_list.includes(item.emp_id)) {
        item.workhour = workhour
        item.qstatus = '已签到'
      }
      item.checked = false
    })
    await AttendanceApi.postGroupTimeDeal(data)
    wx.lin.showToast({ title: '填报成功', icon: 'success' })
    this.setData({
      popupShow: false,
      workhour: '',
      list,
      currentId: null,
      disabled: false,
    })
  },
})
