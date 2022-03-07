// pages/site-manage/video-surveillance/video-surveillance.js
import VideoApi from '../../../api/site/video-model'
import StorageCache from '../../../tools/storage-cache'
import { permissionHide } from '../../../tools/utils'
import { setScrollHeight, setPageScrollViewEvent } from '../../../tools/system-info'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    barColor: 'transparent',
    contentHeight: 0,
    projects: [],
    projectName: {},
    showPopupN: false,
    isLoading: true,
    list: [],
    total: 0,
    on_line: 0,
    off_line: 0,
  },

  async onLoad() {
    await setScrollHeight(this)
    const { data: projects } = await this.getProjectList()
    const projectName = projects[0]
    this.setData({
      projectName, projects
    })
    permissionHide(this, 439)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getData()
  },

  async getProjectList() {
    return {
      data: [
        {
          project_id: 1,
          project_name: 'S107关中环线大中修工程项目',
        },
        {
          project_id: 11,
          project_name: '工程项目2'
        }
      ],
      info: {
        info1: '2021-12-15',
        info2: '2023-07-21',
        info3: '35天',
        info4: '489天',
      }
    }
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

  selectTap() {
    this.setData({ showPopupN: true })
  },

  popupItemClick(e) {
    const idx = +e.target.id
    this.setData({ projectName: this.data.projects.find(item => item.project_id === idx), showPopupN: false })
  },

  async scrolling(e) {
    setPageScrollViewEvent(e, this)
  },
})
