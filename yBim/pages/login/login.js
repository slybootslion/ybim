// pages/login/login.js
import UserApi from '../../api/user/user-model'
import StorageCache from '../../tools/storage-cache'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.lin.initValidateForm(this)
  },
  async submit(e) {
    if (this.data.disabled) return
    const { password, username } = e.detail.values
    this.setData({ disabled: true })
    if (!password || !username) {
      wx.lin.showToast({
        title: '用户名或密码未填写',
        icon: 'error',
      })
      this.setData({ disabled: false })
      return
    }

    const data = await UserApi.login({ password, username })
    if (data && data.token) {
      StorageCache.setToken(data.token)
      const userInfo = { user: data.user, hidden: data.setting.hidden }
      StorageCache.setUserInfo(userInfo)
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }

    this.setData({ disabled: false })
  },
})
