// pages/site-manage/video-manage/video-manage.js
import VideoApi from '../../../api/site/video-model'
import { toVideoFormPage } from '../hooks/equipment-hooks'
import EnvironApi from "../../../api/site/environ-model";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    list: [],
    company_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getData()
  },

  async getData() {
    this.setData({ isLoading: true })
    const { data, company_list } = await VideoApi.getVideosList()
    this.setData({ isLoading: false, list: data, company_list })
  },

  toFormPage(e) {
    let detail = ''
    if (e.detail.video_id) detail = e.detail
    toVideoFormPage(detail, this.data.company_list, '/pages/site-manage/video-form/video-form')
  },

  async handleDel (e) {
    const { video_id } = e.detail
    await VideoApi.postVideosDelete({ video_id })
    const list = this.data.list.filter(item => item.video_id !== video_id)
    this.setData({ list })
  }
})
