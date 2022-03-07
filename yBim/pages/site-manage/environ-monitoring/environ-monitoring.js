// pages/site-manage/environ-monitoring/environ-monitoring.js
import EnvironApi from '../../../api/site/environ-model'
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
    isLoading: true,
    list: [],
    count: 0,
    online: 0,
    offline: 0,
    currentIndex: 0,
    showPopup: false,
    showPopupN: false,
    detail2List: [
      { icon: 'icon-wendu', name: '温度', key: 'CTemV', unit: '℃' },
      { icon: 'icon-icontubiao', name: '湿度', key: 'CHumV', unit: '%R/H' },
      { icon: 'icon-PM1', name: 'PM2.5', key: 'CPM2_5V', unit: 'ug/m³' },
      { icon: 'icon-PM', name: 'PM10', key: 'CPM10V', unit: 'ug/m³' },
      { icon: 'icon-fengsu', name: '风速', key: 'CFSV', unit: 'KM/H' },
      { icon: 'icon-TSP', name: 'TSP', key: 'CTSPV', unit: 'ug/m³' },
      { icon: 'icon-zaoyin', name: '噪音', key: 'CDBV', unit: 'db' },
      // { icon: 'icon-qiya', name: '气压', key: 'CDBV', unit: 'KPA' },
    ],
    detail3List: [
      { name: 'PM2.5合格天数', key: 'PM2_5GDC', unit: '天' },
      { name: 'PM10合格天数', key: 'PM10GDC', unit: '天' },
      // {name: '主要风向', key: ''},
      { name: '日间平均气温', key: 'BTemV', unit: '℃' },
      { name: '夜间平均气温', key: 'YTemV', unit: '℃' },
      { name: '平均湿度', key: 'PHumV', unit: '%R/H' },
      { name: '平均音量', key: 'PDBV', unit: 'db' },
      { name: '平均TSP', key: 'PTSPV', unit: 'ug/m³' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    await setScrollHeight(this)
    const { data: projects } = await this.getProjectList()
    const projectName = projects[0]
    this.setData({
      projectName, projects
    })
    permissionHide(this, 389)
  },

  onShow() {
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
    const list = await EnvironApi.getMonitorsList()
    let count = 0
    let online = 0
    let offline = 0
    list.forEach(item => {
      ++count
      if (item.Status === '在线') ++online
      else ++offline
    })
    this.setData({
      count,
      online,
      offline,
      list,
      isLoading: false,
    })
  },

  toMangePage() {
    wx.navigateTo({
      url: '/pages/site-manage/equipment-manage/equipment-manage'
    })
  },

  checkShowType(e) {
    return +e.currentTarget.dataset.showType
  },

  selectTap(e) {
    this.checkShowType(e) === 1 ? this.setData({ showPopupN: true }) : this.setData({ showPopup: true })
  },

  popupItemClick(e) {
    const idx = +e.target.id
    if (this.checkShowType(e) === 1) {
      this.setData({ projectName: this.data.projects.find(item => item.project_id === idx), showPopupN: false })
    } else {
      this.setData({ currentIndex: idx, showPopup: false })
    }
  },

  leftTap() {
    this.triggerEvent('leftBtnTap')
  },

  async scrolling(e) {
    setPageScrollViewEvent(e, this)
  },
})
