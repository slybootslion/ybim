// index.js
// 获取应用实例
import StorageCache from '../../tools/storage-cache'
import CtrlApi from '../../api/controls/ctrl-model'
import BaseDataApi from '../../api/base-data/base-data-model'
import { setPageScrollViewEvent, setScrollHeight } from '../../tools/system-info'
// import * as echarts from '../../components/ec-canvas/echarts'

const baseModelList = {
  rygl: { title: '人员管理' },
  jdgl: { title: '进度管理' },
  zlgl: { title: '质量管理' },
  hjjc: { title: '环境监测' },
  sbgl: { title: '设备管理' },
}

let eOpts = {}

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  let option = eOpts
  chart.setOption(option);
  return chart;
}

Page({
  data: {
    showPopup: false,
    projects: [],
    projectInfo: {
      info1: '2021-12-15',
      info2: '2023-07-21',
      info3: '35天',
      info4: '489天',
    },
    companyName: {},
    modelList: baseModelList,
    isLoading: true,
    contentHeight: 0,
    barColor: 'transparent',
    ec: {},
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
    companyName && this.getIndexData(companyName.builing_id)
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
    const res1 = await CtrlApi.getInfo({ builing_id })
    const res2 = await CtrlApi.getControlsWorkinfo({ builing_id })
    const res3 = await CtrlApi.getControlsQualityinfo({ builing_id })
    console.log(res2)
    const infoList = {
      info1: [
        { key: '在册人数', value: `${res1.data.zc_num}人` },
        { key: '进场人员', value: `${res1.data.inspace_num}人` },
        { key: '今日出勤', value: `${res1.data.dk_num}人` },
      ],
      info2: [
        { key: '未完成任务', value: res2.work_info[0].undone_plan },
        { key: '已完成任务', value: res2.work_info[1].done_plan },
        { key: '逾期任务', value: res2.work_info[2].overdue_plan },
      ],
      info3: [
        { key: '累计检查', value: res3.quality_info.allc },
        { key: '待复查', value: res3.quality_info.recheckc },
        { key: '待整改', value: res3.quality_info.rectifyc },
        { key: '超期隐患', value: res3.quality_info.expirec },
      ]
    }
    const { modelList } = this.data
    modelList.rygl.content = infoList.info1
    modelList.jdgl.content = infoList.info2
    modelList.zlgl.content = infoList.info3
  },
  async getVideos(builing_id) {
    try {
      const videos = await CtrlApi.getVideos({ builing_id })
      const { modelList } = this.data
      modelList.sbgl.content = [
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
      modelList.hjjc.content = [
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
