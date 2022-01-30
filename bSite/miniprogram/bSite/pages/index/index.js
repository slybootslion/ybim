// index.js
// 获取应用实例
import StorageCache from '../../tools/storage-cache'
import CtrlApi from '../../api/controls/ctrl-model'
import BaseDataApi from '../../api/base-data/base-data-model'
import { setPageScrollViewEvent, setScrollHeight } from '../../tools/system-info'

const baseModelList =  {
  hmc: { title: '花名册' },
  jrkq: { title: '今日考勤' },
  gz: { title: '工资' },
  hjjk: { title: '环境监控' },
  spjk: { title: '视频监控' },
}

Page({
  data: {
    companyName: {},
    showPopup: false,
    companies: [],
    modelList: baseModelList,
    isLoading: true,
    contentHeight: 0,
    barColor: 'transparent',
  },
  async onLoad() {
    await setScrollHeight(this)
    this.checkAuth()
    const companies = await this.getCompany()
    const companyName = companies[0]
    this.setData({
      companies,
      companyName,
      isLoading: false,
    })
    this.getIndexData(companyName.builing_id)
  },
  async checkAuth() {
    const token = await StorageCache.getToken()
    if (!token) wx.reLaunch({ url: '/pages/login/login' })
  },
  selectCompany() {
    this.setData({
      showPopup: true,
    })
  },
  popupItemClick(e) {
    const builing_id = +e.target.id
    const companyName = this.data.companies.find(c => c.builing_id === builing_id)
    this.setData({
      companyName,
      showPopup: false,
      modelList: baseModelList
    })
    this.getIndexData(builing_id)
  },
  async getCompany() {
    const res = await BaseDataApi.getCompany()
    return res.data
  },
  async getInfo(builing_id) {
    const info = await CtrlApi.getInfo({ builing_id })
    const { modelList } = this.data
    modelList.hmc.content = [
      { key: '在场人员', value: info.zc_num },
      { key: '下属班组', value: info.bz_num },
    ]
    modelList.jrkq.content = [
      { key: '今日出勤', value: info.today_num },
      { key: '考勤率', value: info.cql },
      // { key: '设备考勤', value: '' },
      // { key: '自报考勤', value: '23个' },
    ]
    modelList.gz.content = [
      { key: '记工金额', value: info.s_pay },
      { key: '记工人数', value: info.worker_num },
      { key: '待付金额', value: info.d_pay },
    ]
    this.setData({ modelList })
  },
  async getVideos(builing_id) {
    try {
      const videos = await CtrlApi.getVideos({ builing_id })
      const { modelList } = this.data
      modelList.spjk.content = [
        { key: '设备总数', value: videos.total },
        { key: '在线设备', value: videos.on_line },
        { key: '离线设备', value: videos.off_line },
      ]
      this.setData({ modelList })
    } catch (err) {
      wx.showToast({
        icon: 'none',
        message: '获取视频信息失败',
      })
    }
  },
  async getWeather(builing_id) {
    try {
      const weather = await CtrlApi.getWeather({ builing_id })
      const { modelList } = this.data
      modelList.hjjk.content = [
        { key: 'PM2.5', value: weather.pm2 },
        { key: 'PM10', value: weather.pm10 },
        { key: '温度', value: weather.temperature },
        { key: '湿度', value: weather.humidity },
        { key: '风速', value: weather.windspeed },
        { key: 'TSP', value: weather.tsp },
        { key: '噪音', value: weather.noise },
        { key: '天气', value: weather.weather },
      ]
      this.setData({ modelList })
    } catch (err) {
      wx.showToast({
        icon: 'none',
        message: '获取环境监测信息失败',
      })
    }
  },
  async getIndexData(builing_id) {
    this.getInfo(builing_id)
    this.getVideos(builing_id)
    this.getWeather(builing_id)
  },
  async scrolling(e) {
    setPageScrollViewEvent(e, this)
  },
})
