// pages/my-app/edit-password/edit-password.js
import BaseDataApi from '../../../api/base-data/base-data-model'
import hookLogout from '../hooks/to-Login-hook'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    btnDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  onOPswChange(e) {
    const { value } = e.detail
    this.data.oPsw = value
  },

  onNPswChange(e) {
    const { value } = e.detail
    this.data.nPsw = value
  },

  onNPswAChange(e) {
    const { value } = e.detail
    this.data.nPswA = value
  },

  async submit() {
    let { oPsw, nPsw, nPswA } = this.data
    oPsw = oPsw.trim()
    nPsw = nPsw.trim()
    nPswA = nPswA.trim()
    if (!oPsw || !nPsw || !nPswA) {
      wx.lin.showToast({
        title: '有必要信息未填写',
        icon: 'error',
      })
      return
    }

    if (nPsw !== nPswA) {
      wx.lin.showToast({
        title: '新密码与确认密码不一致',
        icon: 'error'
      })
      return
    }

    this.setData({ btnDisabled: true })
    try {
      const data = {
        passwordo: oPsw,
        password: nPsw,
        password2: nPswA
      }
      await BaseDataApi.putSystemsEditpw(data)
      hookLogout()
    } catch (error) {
      this.setData({ btnDisabled: false })
    }

  }
})