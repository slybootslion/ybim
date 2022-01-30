// pages/site-manage/video-surveillance-detail/video-surveillance-detail.js
import StorageCache from '../../../tools/storage-cache'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '视频播放',
    data_url: '',
    detail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },
  async init() {
    const detail = await StorageCache.getVideoItemInfo()
    const { title, data_url } = detail
    this.setData({
      detail,
      title,
      data_url,
    })
  },

  async beforeBackPage () {
    await StorageCache.removeVideoItemInfo()
  }
})
