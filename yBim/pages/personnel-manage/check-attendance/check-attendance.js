// pages/personnel-manage/check-attendance/check-attendance.js
import StorageCache from '../../../tools/storage-cache'
import RosterApi from '../../../api/personnel/roster-model'
import dayjs from '../../../tools/dayjs.min'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.emp_id = options.emp_id
  },

  async getData() {
    const { fullDate } = this.data
    if (dayjs(fullDate).isAfter(new Date())) {
      this.renderMonth()
      return false
    }
    this.setData({ isLoading: true })
    const personDetail = await StorageCache.getPersonDetail()
    const { emp_id, s_date } = this.data
    const data = { emp_id, s_date, type: 'viewkq' }
    const { p_log, p_data, t_timenum, t_workhour } = await RosterApi.getRostersInfo(data)
    this.setData({ personDetail, emp_id, isLoading: false, p_log, p_data, t_timenum, t_workhour })
    this.renderMonth()
  },

  renderMonth() {
    const { s_date, day, p_data, p_log } = this.data
    const week = dayjs(s_date + '01').day()
    const blockNum = week - 1 >= 0 ? week - 1 : 6
    const blockArr = new Array(blockNum)
    const list = blockArr.concat(p_data)
    list.forEach(item => {
      if (item.day && item.day === +day) item.active = true
      else delete item.active
      if (dayjs(`${s_date}-${item.day}`).isAfter(new Date())) item.disable = true
    })
    let currentLog = null
    if (p_log.length) {
      currentLog = p_log.find(item => {
        return +item.month.split('-')[2] === +day
      }) || null
    }
    this.setData({ list, currentLog })
  },

  handleDateChange(params) {
    this.data.fullDate = params.detail
    this.data.s_date = params.detail.slice(0, -3)
    this.data.day = params.detail.slice(-2)
    this.getData()
  },

  itemTap(e) {
    const index = e.currentTarget.dataset.index
    let { list, s_date } = this.data
    const currentData = list[index]
    if (currentData.disable) return false
    this.setData({
      fullDate: s_date + '-' + currentData.day,
      day: currentData.day,
    })
    this.renderMonth()
  }
})