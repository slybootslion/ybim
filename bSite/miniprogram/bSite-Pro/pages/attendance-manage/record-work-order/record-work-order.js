// pages/record-work-order/record-work-order.js
import RecordApi from '../../../api/attendance/record-model'
import StorageCache from '../../../tools/storage-cache'
import { permissionHide } from '../../../tools/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const data = {
      457: 'hide1',
      458: 'hide2',
      459: 'hide3',
    }
    permissionHide(this, [457, 458, 459], data)
  },
  onShow(options) {
    this.getData()
  },
  async getData() {
    this.setData({ isLoading: true })
    const res = await RecordApi.getTimeticketsList()
    const { data, company } = res
    this.setData({
      isLoading: false,
      company_list: company, list: data
    })
  },
  delItem(e) {
    const { ticket_id } = e.detail
    const list = this.data.list.filter(item => item.ticket_id !== ticket_id)
    this.setData({ list })
  },

  async recordAdd() {
    const { company_list } = this.data
    await StorageCache.setEmpList({ company_list })
    wx.navigateTo({
      url: '/pages/attendance-manage/add-word-order/add-word-order',
    })
  },

  async toFormPage(e) {
    const { ticket_id } = e.detail
    this.setData({ isLoading: true })

    const { data, company } = await RecordApi.getTimeticketsList({ ticket_id })

    await StorageCache.setEmpList({
      company_list: company,
      detail: data[0]
    })

    wx.navigateTo({
      url: '/pages/attendance-manage/add-word-order/add-word-order',
    })
  }
})