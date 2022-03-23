// pages/personnel-manage/select-workers/select-workers.js
import SelectWorkerStore from '../hooks/select-worker-store'
import { formatFloat } from '../../../tools/utils'
// import RecordApi from '../../../api/attendance/record-model'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countNum: 0,
    isLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },

  init() {
    const store = new SelectWorkerStore()
    let empList = store.getEmpList()
    if (empList.length) {
      this.data.empList = empList
      this.setData({ countNum: this.computedCountNum() })
    }
    this.setData({
      store,
      empList
    })
  },

  checkList(list) {
    let status = true

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (element.ticket_money <= 0) return false
      if (!element.w_day) return false
      if (!element.w_pay) return false
    }

    return status
  },

  submit() {
    const { empList, store } = this.data
    const selectEmpList = empList.filter(emp => emp.selected)
    if (!this.checkList(selectEmpList)) {
      wx.showToast({
        title: '所选人员有必要信息未填写，或填写有误',
        icon: 'none'
      })
      return
    }
    store.setTicketEmp(selectEmpList)
    wx.navigateBack()
  },

  onSelectTap(e) {
    let { empList } = this.data
    const current = empList[e.detail]

    current.selected ? delete current.selected : current.selected = true
    const countNum = this.computedCountNum()
    this.setData({ empList, countNum })
  },

  onPayInput(e) {
    let { empList } = this.data
    const current = empList[e.detail.index]
    const data = e.detail.data
    current.ticket_money = data.ticket_money
    current.w_award = data.w_award
    current.w_cutpay = data.w_cutpay
    current.w_day = data.w_day
    current.w_pay = data.w_pay
    // current.selected = true
    const countNum = this.computedCountNum()
    this.setData({
      countNum,
      empList
    })
  },

  computedCountNum() {
    const { empList } = this.data
    const countNum = empList.reduce((pre, cur) => {
      if (cur.selected) return pre += parseFloat(formatFloat(+cur.ticket_money, 2))
      return pre
    }, 0)
    return parseFloat(formatFloat(countNum, 2))
  }
})