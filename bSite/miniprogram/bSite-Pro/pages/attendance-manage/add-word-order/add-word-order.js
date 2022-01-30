// pages/attendance-manage/add-word-order/add-word-order.js
import StorageCache from '../../../tools/storage-cache'
import dayjs from '../../../tools/dayjs.min'
import SelectWorkerStore from '../hooks/select-worker-store'
import RecordApi from '../../../api/attendance/record-model'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '新建记工单',
    nowTime: dayjs(new Date()).format('YYYY-MM-DD'),
    editBuilingId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },

  async init() {
    const { company_list, detail } = await StorageCache.getEmpList()

    if (detail && detail.ticket_id) {
      this.initEditData(detail)
    }

    this.setData({ company_list })
  },

  async initEditData(detail) {
    console.log(detail)
    const { name, builing_id, ticket_id, company_name, end_time, remark, create_time, emp_id_list, ticket_e } = detail

    await this.initStore(builing_id, end_time)

    const { store } = this.data
    // store.setTicketEmp(ticket_e)
    const temp = [...store.getEmpList()]
    const ticketObj = {}
    for (let i = 0; i < emp_id_list.length; i++) {
      const empKey = emp_id_list[i]
      const value = ticket_e.find(item => item.emp_id === empKey)
      ticketObj[empKey] = value
    }

    const t = temp.map(item => {
      if (emp_id_list.includes(item.emp_id)) {
        item = ticketObj[item.emp_id]
        item.selected = true
      }
      return item
    })

    store.setEmpList(t)
    store.setTicketEmp(ticket_e)

    const data = {
      name,
      builing_id,
      editBuilingId: builing_id,
      ticket_id,
      company_name,
      end_time,
      remark,
      nowTime: create_time
    }
    if (!data.editOriginData) data.editOriginData = detail
    this.setData(data)
  },

  onName(e) {
    const { value } = e.detail
    this.data.name = value
  },

  async handleCompany(e) {
    if (this.data.ticket_id) {
      this.onCompanyIdByEdit(e)
    } else {
      this.onCompanyId(e)
    }
  },

  async onCompanyIdByEdit(e) {
    const { value: selectBuilingId } = e.detail
    const { editBuilingId } = this.data
    if (selectBuilingId !== editBuilingId) this.onCompanyId({ detail: { value: selectBuilingId } })
    else {
      this.initEditData(this.data.editOriginData)
    }
  },

  async onCompanyId(e) {
    const { value: builing_id } = e.detail
    const { end_time } = this.data
    await this.initStore(builing_id, end_time)
  },

  async initStore(builing_id = '', end_time = '') {
    this.setData({ isLoading: true })
    const sws = new SelectWorkerStore(this)
    const res = await RecordApi.getTimeticketsEmplist({ builing_id, end_time })
    sws.setEmpList(res.data)
    this.data.store = sws
    this.setData({ builing_id, isLoading: false })
  },

  async onEndTime(e) {
    const { value } = e.detail
    this.data.end_time = value
    const { builing_id } = this.data
    await this.initStore(builing_id, value)
  },

  onRemark(e) {
    const { value } = e.detail
    this.data.remark = value
  },

  showToast(title) {
    wx.lin.showToast({
      title,
      icon: 'error'
    })
  },

  showWarning() {
    this.showToast('先选择公司')
  },

  goSelectPage() {
    wx.navigateTo({
      url: `/pages/attendance-manage/select-workers/select-workers`,
    })
  },

  async submit() {
    const { name, end_time, builing_id, remark, TicketEmp, ticket_id } = this.data
    if (!name || !end_time || !builing_id || !TicketEmp.length) {
      this.showToast('有必要信息未填写')
      return false
    }

    const tempTicketEmp = {}
    TicketEmp.forEach((item, index) => {
      const data = {
        date_duan: item.date_duan,
        ticket_money: item.ticket_money,
        w_award: item.w_award,
        w_cutpay: item.w_cutpay,
        w_day: item.w_day,
        w_pay: item.w_pay,
        emp_id: item.emp_id,
      }
      tempTicketEmp[index] = data
    })
    const data = { name, end_time, builing_id, TicketEmp: JSON.stringify(tempTicketEmp) }

    data.remark = remark ? remark : ''

    if (ticket_id) {
      data.ticket_id = ticket_id
      await RecordApi.putTimeticketsEdit(data)
    } else {
      await RecordApi.postTimeticketsAdd(data)
    }
    try {
      await StorageCache.removeEmpList()
      wx.navigateBack()
    } catch (error) {
      
    }
  }

})