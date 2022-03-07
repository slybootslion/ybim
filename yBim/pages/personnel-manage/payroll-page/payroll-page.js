// pages/attendance-manage/payroll-page/payroll-page.js
import PayrollApi from '../../../api/attendance/payroll-model'
import { permissionHide } from '../../../tools/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad () {
    const data = {
      479: 'hide1',
      465: 'hide2',
    }
    permissionHide(this, [479, 465], data)
  },
  onShow(options) {
    this.getData()
  },

  async getData() {
    const { data: list, total } = await PayrollApi.getTimeticketsWorkclear()
    this.setData({ list, total })
  }

})