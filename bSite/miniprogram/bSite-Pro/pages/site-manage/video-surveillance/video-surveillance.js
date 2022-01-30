// pages/site-manage/video-surveillance/video-surveillance.js
import VideoApi from '../../../api/site/video-model'
import StorageCache from '../../../tools/storage-cache'
import { permissionHide } from '../../../tools/utils'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    list: [],
    total: 0,
    on_line: 0,
    off_line: 0,
  },

  onLoad() {
    permissionHide(this, 439)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getData()
  },

  async getData() {
    this.setData({ isLoading: true })
    const { data, total, off_line, on_line } = await VideoApi.getVideosList()
    this.setData({ isLoading: false, list: data, total, off_line, on_line })
  },

  async goPlayPage(e) {
    const { index } = e.currentTarget.dataset
    const current = this.data.list[index]
    await StorageCache.setVideoItemInfo(current)
    const url = '/pages/site-manage/video-surveillance-detail/video-surveillance-detail'
    wx.navigateTo({ url })
  },

  async toMangePage() {
    wx.navigateTo({ url: '/pages/site-manage/video-manage/video-manage' })
  },
})
