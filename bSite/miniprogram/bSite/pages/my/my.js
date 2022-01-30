// pages/my/my.js
import { setScrollHeight } from '../../tools/system-info'
setScrollHeight
import BaseDataApi from '../../api/base-data/base-data-model'
import StorageCache from '../../tools/storage-cache'
import hookLogout from '../my-app/hooks/to-Login-hook'

const urlData = {
  '0': '/pages/my-app/my-info/my-info',
  '1': '/pages/my-app/edit-password/edit-password',
  '2': '/pages/my-app/work-manage/work-manage',
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    barColor: 'transparent',
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await setScrollHeight(this)
    this.getData()
  },

  async getData() {
    const info = await BaseDataApi.getMySystemInfo()
    this.setData({ info })
  },

  async itemTap(e) {
    const { idx } = e.currentTarget.dataset
    if (idx === '0') await StorageCache.setMyInfo(this.data.info)
    const url = urlData[idx]
    wx.navigateTo({ url })
  },

  logout() {
    wx.lin.showDialog({
      type: 'confirm',
      content: '是否确认退出',
      zIndex: 1000,
      success: (e) => {
        const { cancel } = e
        if (cancel) return false
        hookLogout('退出完毕')
      }
    })
  }
})