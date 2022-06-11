// pages/personnel-manage/payroll-info/payroll-info.js
import PayrollApi from '../../../api/attendance/payroll-model'
import { promisic } from '../../../lu-ui/utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket_id: '',
    isLoading: true,
    isPaied: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.ticket_id = +options.ticket_id
    const infoType = options.type ? true : false
    this.setData({ infoType })
    this.getData()
  },

  async getData() {
    const { ticket_id } = this.data
    const info = await PayrollApi.getTimeticketsWorkpayinfo({ ticket_id })
    const isPaied = info.h_pay > 0
    const images = info.h_pay_cert && info.h_pay_cert.map(image => {
      return 'http://bjbsite.com/' + image.url
    })
    this.setData({ info, isLoading: false, images, isPaied })
  },

  async goPay() {
    const { eventChannel } = await promisic(wx.navigateTo)({
      url: `/pages/personnel-manage/pay-page/pay-page`
    })
    eventChannel.emit('ticketData', this.data.info)
    eventChannel.on('success', () => {
      this.getData()
    })

  }
})