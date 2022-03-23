// pages/personnel-manage/pay-page/pay-page.js
import dayjs from '../../../tools/dayjs.min'
import UplaodApi from '../../../api/upload'
import PayrollApi from '../../../api/attendance/payroll-model'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventChannel: null,
    urls: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on && eventChannel.on('ticketData', e => {
      this.data.info = e
    })
    this.data.eventChannel = eventChannel
    this.setData({
      date: dayjs().format('YYYY-MM-DD')
    })
  },

  handleRemark(e) {
    this.data.h_remark = e.detail.value
  },

  handleImage(e) {
    this.data.urls = e.detail.all.map(pic => pic.url)
  },

  async submit() {
    const { urls, info, h_remark, eventChannel } = this.data
    if (!urls.length) {
      wx.lin.showToast({
        title: '未选择支付凭证',
        icon: 'error'
      })
      return
    }
    const ua = new UplaodApi()
    const uploadRes = []
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const originName = url.substring(url.lastIndexOf("/")+1)
      const res = await ua.postImage(url)
      uploadRes.push(`${res.data}|||${originName}`)
    }
    const h_pay_cert = uploadRes.join('---')
    const data = {
      ticket_id: info.ticket_id,
      h_pay: info.s_pay,
      h_remark,
      h_pay_cert,
    }
    const res = await PayrollApi.postTimeticketsGPay(data)
    wx.navigateBack()
    eventChannel.emit('success')
  }

})